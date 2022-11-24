"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Schedule');
const SCHEDULE_CONTROLLER = require('../Controllers/ScheduleController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))
ROUTE.post('/schedules/create', VALIDATION_MIDDLEWARE.create, SCHEDULE_CONTROLLER.create);

module.exports = ROUTE;
