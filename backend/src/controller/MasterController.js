const connection = require('../database/connection');
const { encryptPassword } = require('../util/cAuth');

module.exports = {

    async index(request, response){
        if (process.env.DEV_MODE && process.env.DEV_MODE === 'true'){
            const ongs = await connection('ongs')
                .select('*');
            const incidents = await connection('incidents')
                .select('id', 'title', 'description', 'value', 'ong_id');
            ongs.forEach(ong => {
                ong.incidents = incidents.filter(incident => incident.ong_id === ong.id);
                ong.incidents.forEach(incident=>{
                    delete incident.ong_id;
                });
            });
            return response.json(ongs);
        }else{
            response.status(404).send();
        }

    },

    async resetPassword(request, response){
        if (process.env.DEV_MODE && process.env.DEV_MODE === 'true'){
            const id = request.params['id'];
            const password = request.body['password'];
            const encryptedPassword = encryptPassword(password);
            await connection('ongs').where('id', id).update({password: encryptedPassword});
            return response.json({ok:true});
        }else{
            response.status(404).send();
        }

    }

}