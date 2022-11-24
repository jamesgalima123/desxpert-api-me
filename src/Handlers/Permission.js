"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Permission');
const PERMISSION_CONTROLLER = require('../Controllers/PermissionController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
	
ROUTE.post('/permissions/create', VALIDATION_MIDDLEWARE.create, PERMISSION_CONTROLLER.create);
ROUTE.put('/permissions/update/:id', VALIDATION_MIDDLEWARE.update, PERMISSION_CONTROLLER.update);
ROUTE.get('/permissions/', PERMISSION_CONTROLLER.all);

module.exports = ROUTE;