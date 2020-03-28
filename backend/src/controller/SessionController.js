const connection = require('../database/connection');
const { validatePassword } = require('../util/cAuth');

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
        const copy = Object.assign({}, ong);
        delete copy.password;
        return response.json(copy);
    },

};