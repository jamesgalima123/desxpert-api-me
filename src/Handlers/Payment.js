"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Client');
const PAYMENT_CONTROLLER = require('../Controllers/PaymentController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);
APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))

ROUTE.post('/payment/gcash',  PAYMENT_CONTROLLER.gcash);

module.exports = ROUTE;
  