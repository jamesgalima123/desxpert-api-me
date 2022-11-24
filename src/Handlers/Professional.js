"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Professional');
const PROFESSIONAL_CONTROLLER = require('../Controllers/ProfessionalController');
const fileUpload = require('express-fileupload');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);
APP.use(fileUpload());
APP.use(EXPRESS.static('public')); 
APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))
ROUTE.get('/professionals/:type/:id',PROFESSIONAL_CONTROLLER.getProfessionalPicture);

ROUTE.post('/professionals/register', VALIDATION_MIDDLEWARE.register, PROFESSIONAL_CONTROLLER.register);
ROUTE.put('/professionals/:id/save', VALIDATION_MIDDLEWARE.save, PROFESSIONAL_CONTROLLER.save);
ROUTE.put('/professionals/initial-set-password', VALIDATION_MIDDLEWARE.initialSetPassword, PROFESSIONAL_CONTROLLER.initialSetPassword);

module.exports = ROUTE;
  