const chai = require("chai");
const chaiHttp = require("chai-http");
const { servidor } = require("../index");

chai.use(chaiHttp);

describe("Probando respuesta de servidor para metodo DELETE /anime", () => {
	it("Comprueba que metodo DELETE responde con codigo 200", (done) => {
		chai.request(servidor)
			.delete("/anime?id=6")
			.end((error, respuesta) => {
				chai.expect(respuesta).to.have.status(200);
				done();
			});
	});
});
