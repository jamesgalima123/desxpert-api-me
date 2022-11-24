"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Contract');
const CONTRACT_CONTROLLER = require('../Controllers/ContractController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useAuthenticated(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
ROUTE.post('/contracts/create-contract', VALIDATION_MIDDLEWARE.createContract, CONTRACT_CONTROLLER.createContract);
module.exports = ROUTE;