"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Role');
const ROLE_CONTROLLER = require('../Controllers/RoleController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useAuthenticated(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))

ROUTE.get('/roles', ROLE_CONTROLLER.all);
ROUTE.get('/roles/:id', ROLE_CONTROLLER.get);
ROUTE.post('/roles', VALIDATION_MIDDLEWARE.create, ROLE_CONTROLLER.create);
ROUTE.put('/roles/:id', VALIDATION_MIDDLEWARE.update, ROLE_CONTROLLER.update);
ROUTE.delete('/roles/:id', ROLE_CONTROLLER.delete);

module.exports = ROUTE;
