"use strict";

const EXPRESS = require("express");
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require("../Middlewares/Router");
const VALIDATION_MIDDLEWARE = require("../Middlewares/validations/User");
const USER_CONTROLLER = require("../Controllers/UserController");

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);
APP.use(EXPRESS.static('public')); 
APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
ROUTE.get('/user-pictures/profile-picture/:id',USER_CONTROLLER.getUserProfilePicture);
module.exports = ROUTE;
