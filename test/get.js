const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index');

chai.use(chaiHttp);

describe('Probando respuesta de servidor para metodo GET /anime', () => {
    it('Comprueba que metodo GET responde con codigo 200', (done) => {
        chai.request(servidor).get('/anime').end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        })
    })
})
