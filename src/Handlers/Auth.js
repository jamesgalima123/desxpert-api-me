"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Auth');
const AUTH_CONTROLLER = require('../Controllers/AuthController');
const USER_CONTROLLER = require('../Controllers/UserController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))

ROUTE.post('/auth/signin', VALIDATION_MIDDLEWARE.signIn, AUTH_CONTROLLER.signIn);
ROUTE.put('/auth/set-password', VALIDATION_MIDDLEWARE.setPassword, USER_CONTROLLER.setPassword);

module.exports = ROUTE;