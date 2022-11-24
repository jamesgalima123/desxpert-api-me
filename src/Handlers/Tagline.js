"use strict";

const EXPRESS = require("express");
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require("../Middlewares/Router");
const VALIDATION_MIDDLEWARE = require("../Middlewares/validations/Tagline");
const TAGLINE_CONTROLLER = require("../Controllers/TaglineController");

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useAuthenticated(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))

ROUTE.post('/taglines/create', VALIDATION_MIDDLEWARE.create, TAGLINE_CONTROLLER.create);
ROUTE.put('/taglines/update/:id', VALIDATION_MIDDLEWARE.update, TAGLINE_CONTROLLER.update);
ROUTE.get('/taglines/random', TAGLINE_CONTROLLER.getRandom);
ROUTE.get('/taglines/:id', TAGLINE_CONTROLLER.get);

module.exports = ROUTE;
