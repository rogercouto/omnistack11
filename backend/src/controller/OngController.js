const { generateUniqueId, encryptPassword, validatePassword } = require('../util/cAuth');
const connection = require('../database/connection');

module.exports = {

    async index(request, response){
        const { page = 1 } = request.query;
        const [count] = await connection('ongs').count();
        const ongs = await connection('ongs')
            .where('confirmed', true)
            .limit(5)
            .offset((page-1)*5)
            .select(['name', 'email','phone', 'city', 'uf']);
        response.header('X-Total-Count', count['count(*)']);
        return response.json(ongs);
    },

    async create(request, response){
        const { name, email, password, phone, city, uf} = request.body;
        const exists = await connection('ongs')
            .where('email', email)
            .andWhere('confirmed', true)
            .first();
        if (exists){
            return response.status(400).json({ error: 'ONG with this email already exists.' });
        }
        const encryptedPassword = encryptPassword(password);
        const confirmed = true; 
        const id = generateUniqueId();
        await connection('ongs').insert({
            id, name, email, password: encryptedPassword, phone, city, uf, confirmed
        });
        return response.status(204).send();
    },

    async update(request, response){
        const { name, phone, city, uf} = request.body;
        await connection('ongs').where('id',request.ong_id).update({
            name, phone, city, uf
        });
        return response.status(204).send();
    },

    async delete(request, response){
        const { password } = request.body;
        const ong = await connection('ongs')
            .where('id', request.ong_id)
            .first();
        if (!validatePassword(password, ong.password)){
            return response.status(400).json({ error: 'Password not match.' });
        }
        await connection('incidents').where('ong_id', request.ong_id).delete();
        await connection('ongs').where('id', request.ong_id).delete();
        return response.status(204).send();
    },

    async changePassword(request, response){
        const ong = await connection('ongs')
            .where('id', request.ong_id)
            .first();
        const { password, newPassword} = request.body;
        if (!validatePassword(password, ong.password)){
            return response.status(401).json({ error: 'Current password not match.' });
        }
        const encryptedNewpassword = encryptPassword(newPassword);
        await connection('ongs').update({
            password: encryptedNewpassword
        }).where('id', request.ong_id);
        return response.status(204).send();
    }

};