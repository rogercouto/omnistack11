const express = require('express');
const { getTokenFromHeader, validateToken } = require('./util/cAuth');

const { celebrate, Segments, Joi } = require('celebrate');

const MasterController = require('./controller/MasterController');
const SessionController = require('./controller/SessionController');
const OngController = require('./controller/OngController');
const IncidentController = require('./controller/IncidentController');
const ProfileController = require('./controller/ProfileController');

const routes = express.Router();

function verifyToken(request, response, next){
    const bearerHeader = request.headers['authorization'];
    const bearerToken = getTokenFromHeader(bearerHeader);
    if (bearerToken === undefined){
        return response.status(401).json({ error: 'Authorization token not provided.' });
    }
    const ong = validateToken(bearerToken);
    if (!ong){
        return response.status(403).json({ error: 'Invalid or expired authorization token.' });
    }
    request.ong_id = ong.id;
    next();
}

routes.post('/test', verifyToken,  (request, response)=>{
    response.json({
        ok: true,
        ong: request.ong,
        message: 'Youre authorization token is valid'
    });
});


routes.get('/master', MasterController.index);
routes.post('/master/reset/:id', MasterController.resetPassword);

routes.post('/session', SessionController.create);

routes.get('/ongs', verifyToken, OngController.index);

routes.post('/ongs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        phone: Joi.string().required().min(10).max(11),
        city: Joi.string(),
        uf: Joi.string().required().length(2)
    })
}), OngController.create);

routes.put('/ongs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required().min(10).max(11),
        city: Joi.string(),
        uf: Joi.string().required().length(2)
    })
}), verifyToken, OngController.update);

routes.delete('/ongs', verifyToken, OngController.delete);

routes.patch('/ongs', verifyToken, OngController.changePassword);

routes.get('/profile', verifyToken, ProfileController.index);

//Incidents routes

routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().min(1)
    })
}), IncidentController.index);

routes.get('/incidents/:id', IncidentController.show);

routes.post('/incidents', celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required()
    })
}),verifyToken, IncidentController.create);

routes.put('/incidents/:id', celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required()
    })
}),verifyToken, IncidentController.update);

routes.delete('/incidents/:id', verifyToken, celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    })
}),IncidentController.delete);


module.exports = routes;