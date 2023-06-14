const fs = require("fs/promises");

const borrarObj = async (archivo, id) => {
	try {
		const comicsOriginales = await fs.readFile(`${archivo}.json`);
		const objetoComicsOriginal = JSON.parse(comicsOriginales);

		if (objetoComicsOriginal[id]) delete(objetoComicsOriginal[id]);
		else throw new Error(`No existe el objeto ${id}`);

		await fs.writeFile(`${archivo}.json`, JSON.stringify(objetoComicsOriginal, null, 2));
		return true;
	} catch (err) {
		console.log("Error en borrarObj de borrar.js");
		console.log(err);
		return false;
	}
};

module.exports = { borrarObj: borrarObj };
