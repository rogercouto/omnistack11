const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const SessionController = require('./controller/SessionController');
const OngController = require('./controller/OngController');
const IncidentController = require('./controller/IncidentController');
const ProfileController = require('./controller/ProfileController');

const routes = express.Router();

routes.post('/session', SessionController.create);

routes.get('/ongs', OngController.index);

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

routes.put('/ongs', OngController.update);

routes.delete('/ongs', OngController.delete);

routes.patch('/ongs', OngController.changePassword);

routes.get('/profile', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}), ProfileController.index);

routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().min(1)
    })
}), IncidentController.index);

routes.get('/incidents/:id', IncidentController.show);

routes.post('/incidents', IncidentController.create);

routes.put('/incidents/:id', IncidentController.update);

routes.delete('/incidents/:id', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required()
    }).unknown(),
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
    })
}),IncidentController.delete);


module.exports = routes;