"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class UserProfile extends BaseQuery {

	constructor(){
		super();
		this.table = "user_profiles";
	}	
}

module.exports = UserProfile;