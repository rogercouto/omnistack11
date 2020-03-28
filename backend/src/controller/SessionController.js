const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const { validatePassword, generateToken } = require('../util/cAuth');

module.exports = {

    async create(request, response){
        const { email, password } = request.body;
        const ong = await connection('ongs')
            .where('email', email)
            .andWhere('confirmed', true)
            .select('*')
            .first();
        if (!ong){
            return response.status(404).json({ error: 'No ONG found with this email.' });
        }
        if (!validatePassword(password, ong.password)){
            return response.status(400).json({ error: 'Password don\'t match.' });
        }
       delete ong.password;
       const token = generateToken(ong);
        response.json({
            auth: true,
            ong: ong,
            token
        })
    },

};