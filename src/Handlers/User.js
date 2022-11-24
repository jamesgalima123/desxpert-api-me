"use strict";

const EXPRESS = require("express");
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require("../Middlewares/Router");
const VALIDATION_MIDDLEWARE = require("../Middlewares/validations/User");
const USER_CONTROLLER = require("../Controllers/UserController");

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useAuthenticated(ROUTE);
APP.use(EXPRESS.static('public')); 
APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
ROUTE.get('/users/profile-picture/:id',USER_CONTROLLER.getUserProfilePicture);
ROUTE.get('/users/:id', USER_CONTROLLER.get);
ROUTE.get('/users/', USER_CONTROLLER.all);
ROUTE.post('/users', VALIDATION_MIDDLEWARE.create, USER_CONTROLLER.create);
ROUTE.put('/users/update/:id', VALIDATION_MIDDLEWARE.update, USER_CONTROLLER.update);
ROUTE.put('/users/set-password', VALIDATION_MIDDLEWARE.setPassword, USER_CONTROLLER.setPassword);
module.exports = ROUTE;
