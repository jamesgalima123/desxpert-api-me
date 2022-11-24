"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Client');
const CLIENT_CONTROLLER = require('../Controllers/ClientController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);
APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))

ROUTE.put('/clients/initial-set-password', VALIDATION_MIDDLEWARE.initialSetPassword, CLIENT_CONTROLLER.initialSetPassword);
ROUTE.post('/clients/register', VALIDATION_MIDDLEWARE.register, CLIENT_CONTROLLER.register);

module.exports = ROUTE;
  