"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class EmailVerification extends BaseQuery {

	constructor(){
		super();
		this.table = "email_verifications";
	}	
}

module.exports = EmailVerification;
