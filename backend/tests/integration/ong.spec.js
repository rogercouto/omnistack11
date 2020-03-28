const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');
const fs = require('fs');

describe('ONG', () => {
    beforeEach(async ()=>{
        await connection.migrate.latest();
    });
    afterAll(async ()=>{
        await connection.destroy();
        fs.unlink('src/database/test.sqlite', function (err) {
            if (err) 
                console.log(err);
        }); 
    })
    let id = null;
    it('Should be able to create a new ONG', async () => {
        const response = await request(app).post('/ongs').send({
            name : "ONG de Testes",
            email : "ongntestes@gmail.com",
            password: "ong123",
            phone : "55999990000",
            city : "Porto Alegre",
            uf : "RS"
        }); 
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
        id = response.body.id;
    });
    it('Should be able to delete a last inserted ong', async () => {
        const response = await request(app)
            .delete('/ongs')
            .set('Authorization', id)
            .send({
                password: 'ong123'
            }
        );
        expect(response.status).toBe(204);
    });
    
});
