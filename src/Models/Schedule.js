"use strict";

const BaseQuery = require('../Helpers/SqlHelper');

class Schedule extends BaseQuery {

	constructor(){
		super();
		this.table = "professional_schedules";
	}	

	
}

module.exports = Schedule;
