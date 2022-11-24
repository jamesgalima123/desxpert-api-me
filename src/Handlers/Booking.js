"use strict"

const EXPRESS = require('express');
const APP = EXPRESS();
const ROUTER_MIDDLEWARE = require('../Middlewares/Router');
const VALIDATION_MIDDLEWARE = require('../Middlewares/validations/Booking');
const BOOKING_CONTROLLER = require('../Controllers/BookingController');
const fileUpload = require('express-fileupload');

const ROUTE = EXPRESS.Router();

ROUTER_MIDDLEWARE.useStandard(ROUTE);
APP.use(fileUpload());
APP.use(EXPRESS.static('public')); 
APP.use(EXPRESS.json({ strict: false }))
	.use(EXPRESS.urlencoded({ extended: true }))
	
ROUTE.post('/bookings/send-booking', VALIDATION_MIDDLEWARE.sendBooking, BOOKING_CONTROLLER.sendBooking);
ROUTE.get('/bookings/get-booking/:professional_uuid/:uuid', VALIDATION_MIDDLEWARE.getBooking, BOOKING_CONTROLLER.getBooking);
module.exports = ROUTE;