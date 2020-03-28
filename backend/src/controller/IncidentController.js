const connection = require('../database/connection');

function convert(incident){
    return {
        id: incident.id,
        title : incident.title,
        description: incident.description,
        value: incident.value,
        ong: {
            name: incident.name,
            email: incident.email,
            phone: incident.phone,
            city: incident.city,
            uf: incident.uf
        }
    }
}

module.exports = {

    async index(request, response){
        const { page = 1 } = request.query;
        const [count] = await connection('incidents').count();
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page-1)*5)
            .select(['incidents.id','incidents.title', 'incidents.description', 'incidents.value' ,
                        'ongs.name', 'ongs.email', 'ongs.phone', 'ongs.city', 'ongs.uf']);
        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents.map(convert));
    },

    async show(request, response){
        const {id} = request.params;
        const incident = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .where('incidents.id',id)
            .select(['incidents.title', 'incidents.description', 'incidents.value' ,
                'ongs.name', 'ongs.email', 'ongs.phone', 'ongs.city', 'ongs.uf'])
            .first(); 
        if (!incident){
            return response.status(404).json({ error: 'Incident not found.' });
        } 
        return response.json(convert(incident));      
    },

    async create(request, response){
        const { title, description, value } = request.body;
        const [id] = await connection('incidents').insert({
            title, description, value, ong_id : request.ong_id
        });
        return response.json({ id });
    },

    async update(request, response){
        const { id } = request.params;
        const { title, description, value } = request.body;
        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        if (incident == null){
            return response.status(401).json({error: 'Incident with ID='+id+' not found.'});
        }
        if (incident.ong_id != request.ong_id){
            return response.status(401).json({error: 'Can\'t update incident from another ONG.'});
        }
        await connection('incidents').where('id', id).update(
            { title, description, value}
        );
        return response.status(204).send();
    },

    async delete(request, response){
        const { id } = request.params;
        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        if (incident == null){
            return response.status(404).json({error: 'Incident with ID='+id+' not found.'});
        }
        if (incident.ong_id != request.ong_id){
            return response.status(401).json({error: 'Can\'t delete incident from another ONG.'});
        }
        await connection('incidents').where('id', id).delete();
        return response.status(204).send();
    }

};