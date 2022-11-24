"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Verification extends BaseQuery {

	constructor(){
		super();
		this.table = "email_verifications";
	}	
}

module.exports = Verification;