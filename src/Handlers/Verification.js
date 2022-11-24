"use strict";

const EXPRESS = require("express");
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require("../Middlewares/Router");
const USER_CONTROLLER = require("../Controllers/UserController");

const ROUTE = EXPRESS.Router();
ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))

ROUTE.get('/users/verification/:verification_code/verify', USER_CONTROLLER.verify);

module.exports = ROUTE;
