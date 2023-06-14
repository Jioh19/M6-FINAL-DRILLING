const fs = require("fs/promises");

const creaObj = async (nuevoObj, archivo) => {
	try {
		const archivoOriginal = await fs.readFile(`${archivo}.json`);
		const datosOriginales = JSON.parse(archivoOriginal);
		const length = Object.keys(datosOriginales).length;

		datosOriginales[length + 1] = nuevoObj;
		await fs.writeFile(`${archivo}.json`, JSON.stringify(datosOriginales, null, 2));
        return true;
	} catch (err) {
		console.log("Error en creaObj de crea.js");
		console.log(err);
        return false;
    }

};

module.exports = { creaObj };
