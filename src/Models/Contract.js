"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Contract extends BaseQuery {

	constructor(){
		super();
		this.table = "contracts";
	}	
}

module.exports = Contract;