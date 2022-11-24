"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Proposal extends BaseQuery {

	constructor(){
		super();
		this.table = "proposals";
	}	
}

module.exports = Proposal;