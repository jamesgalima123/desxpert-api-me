"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Proposal');
const PROPOSAL_CONTROLLER = require('../Controllers/ProposalController');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useAuthenticated(ROUTE);

APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
ROUTE.post('/proposals/create-proposal', VALIDATION_MIDDLEWARE.createProposal, PROPOSAL_CONTROLLER.createProposal);
ROUTE.post('/proposals/get-proposals/:booking_uuid', VALIDATION_MIDDLEWARE.createProposal, PROPOSAL_CONTROLLER.createProposal);
module.exports = ROUTE;