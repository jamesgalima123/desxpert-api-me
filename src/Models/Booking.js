"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Booking extends BaseQuery {

	constructor(){
		super();
		this.table = "bookings";
	}	
}

module.exports = Booking;