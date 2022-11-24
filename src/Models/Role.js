"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Role extends BaseQuery {

	constructor(){
		super();
		this.table = "roles";
	}		
}

module.exports = Role;