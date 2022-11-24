"use strict";

const BaseQuery = require('../Helpers/SqlHelper');

class User extends BaseQuery {

	constructor(){
		super();
		this.table = "users";
	}	

	async getBasicInfo() {

		try {      

			let query = `
					SELECT users.id, users.email, users.status, users.verified, user_profiles.first_name, user_profiles.last_name, roles.role
					FROM users
					LEFT JOIN user_profiles ON users.id = user_profiles.user_id
					LEFT JOIN roles ON users.role_id = roles.id
					ORDER BY user_profiles.first_name ASC
				`;

			let results = await this.query(query);

			return results;

		} catch (err) {
			throw err;
		}
	}
}

module.exports = User;
