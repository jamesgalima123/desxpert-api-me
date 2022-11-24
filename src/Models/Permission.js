"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Permission extends BaseQuery {

	constructor(){
		super();
		this.table = "module_permissions";
	}	
}

module.exports = Permission;