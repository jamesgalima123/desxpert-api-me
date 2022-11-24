"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Profession');
const PROFESSION_CONTROLLER = require('../Controllers/ProfessionController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
    .use(EXPRESS.urlencoded({ extended: true }))
    
ROUTE.post('/professions/create', VALIDATION_MIDDLEWARE.create, PROFESSION_CONTROLLER.create);
ROUTE.get('/professions/get-by-parent', PROFESSION_CONTROLLER.getByParent);
ROUTE.put('/professions/update/:id', VALIDATION_MIDDLEWARE.update, PROFESSION_CONTROLLER.update);
ROUTE.get('/professions/', PROFESSION_CONTROLLER.all);
ROUTE.get('/professions/:id', PROFESSION_CONTROLLER.get);

module.exports = ROUTE;
