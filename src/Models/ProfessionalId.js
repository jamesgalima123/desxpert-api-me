"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class ProfessionalId extends BaseQuery {

	constructor(){
		super();
		this.table = "professional_ids";
	}	
}

module.exports = ProfessionalId;
