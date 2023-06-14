const http = require("http");
const fs = require("fs/promises");

//* Import locales
const { creaObj } = require("./crea");
const { actualizaObj } = require("./actualiza");
const { borrarObj } = require("./borrar");

const server = http.createServer(async (req, res) => {
	const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`);
	const params = new URLSearchParams(searchParams);

    //* Increíble... le encontré una utilidad a ||=
    //* Básicamente revisa si se esta entregando el parámetro ID o nombre, dando preferencia a ID.
	const getArchivo = async (archivo) => {
        let valor = params.get("id");
        valor ||= params.get("nombre");
		try {
			let lecturaArchivo = await fs.readFile(`${archivo}.json`);
            const datosArchivo = JSON.parse(lecturaArchivo);

            //* Acá está la función para seleccionar el anime por ID o por Nombre
            if(valor) {
                if (params.get("id")) {
                    lecturaArchivo = JSON.stringify(datosArchivo[valor]);
                } else {
                    const length = Object.keys(datosArchivo).length;
                    for(let i = 1; i <= length; i++) {
                        if(datosArchivo[i].nombre == valor) {
                            lecturaArchivo = JSON.stringify(datosArchivo[i]);
                        }
                    }
                }
            }
			res.statusCode = 200;
			res.write(lecturaArchivo);
		} catch (err) {
			res.statusCode = 404;
			console.log("Error en la lectura de archivo en getArchivo de index.js");
			console.log(err.message);
		} finally {
			res.end();
		}
	};

	//* Por un lado colocar un tray catch aca lo encuentro excesivo, pero por otro, cabe la posibilidad
	//* y la necesidad de retornar el error al navegador para informar de dicho error.
	const postArchivo = async (archivo) => {
		let datos;
		req.on("data", (data) => {
			datos = JSON.parse(data);
		});
		req.on("end", async () => {
			try {
				if (await creaObj(datos, archivo)) {
					res.statusCode = 200;
					res.write(`Dato agregado exitosamente: ${archivo}.json`);
				} else {
					res.statusCode = 404;
					res.write(`Error al crear: ${archivo}.json`);
				}
			} catch (err) {
				console.log("Error en postArchivo de index.js");
				console.log(err);
			} finally {
				res.end();
			}
		});
	};
	const putArchivo = async (archivo) => {
		const id = params.get("id");
		let datosParaModificar;
		req.on("data", (datos) => {
			datosParaModificar = JSON.parse(datos);
		});
		req.on("end", async () => {
			try {
				if (await actualizaObj(datosParaModificar, archivo, id)) {
					res.statusCode = 200;
					res.write(`Los datos han sido modificados exitosamente: ${archivo}.json`);
				} else {
					res.statusCode = 404;
					res.write(`Error al modificar: ${archivo}.json`);
				}
			} catch (err) {
				console.log("Error en putArchivo de index.js");
				console.log(err);
			} finally {
				res.end();
			}
		});
	};

	const deleteArchivo = async (archivo) => {
		try {
			const id = params.get("id");
			if (await borrarObj(archivo, id)) {
				res.statusCode = 200;
				res.write(`El dato ha sido eliminado exitosamente: ${archivo}.json`);
			} else {
				res.statusCode = 404;
				res.write(`Error en borrar.js`);
			}
		} catch (err) {
			console.log("Error en borrarObj de index.js");
			console.log(err);
		} finally {
			res.end();
		}
	};

	const notFound = () => {
		res.statusCode = 404;
		res.write(`Error 404 Not Found`);
		res.end();
	};

	if (pathname == "/anime") {
		switch (req.method) {
			case "GET":
				getArchivo("anime");
				break;
			case "POST":
				postArchivo("anime");
				break;
			case "PUT":
				putArchivo("anime");
				break;
			case "DELETE":
				deleteArchivo("anime");
				break;
		}
	} else {
		notFound();
	}
});
server.listen(3000, function () {
	console.log("Servidor iniciado en puerto 3000");
});

module.exports = { servidor: server };
