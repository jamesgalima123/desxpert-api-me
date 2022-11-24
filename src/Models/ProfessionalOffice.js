"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class ProfessionalOffice extends BaseQuery {

	constructor(){
		super();
		this.table = "professional_offices";
	}	
}

module.exports = ProfessionalOffice;
