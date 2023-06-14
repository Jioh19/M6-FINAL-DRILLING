const fs = require("fs/promises");

const actualizaObj = async (nuevoObj, archivo, id) => {
    try {
		const datosArchivo = await fs.readFile(`${archivo}.json`);
		const objetoArchivoOriginal = JSON.parse(datosArchivo);
		const datoOriginal = objetoArchivoOriginal[id];
		const datoActualizado = { ...datoOriginal, ...nuevoObj };

        if (objetoArchivoOriginal[id]) objetoArchivoOriginal[id] = datoActualizado;
		else throw new Error(`No existe el objeto ${id}`);

		await fs.writeFile(`${archivo}.json`, JSON.stringify(objetoArchivoOriginal, null, 2));
        return true;
	} catch (err) {
		console.log("Error en actualizaObj de actualiza.js");
		console.log(err);
        return false;
	}

};

module.exports = { actualizaObj: actualizaObj };
