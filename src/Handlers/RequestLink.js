"use strict";

const EXPRESS = require("express");
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require("../Middlewares/Router");
const USER_CONTROLLER = require("../Controllers/UserController");
const VALIDATION_MIDDLEWARE = require("../Middlewares/validations/User");

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))

ROUTE.post('/users/request-link/request-reset-password', VALIDATION_MIDDLEWARE.requestResetPassword, USER_CONTROLLER.requestResetPassword);

module.exports = ROUTE;
