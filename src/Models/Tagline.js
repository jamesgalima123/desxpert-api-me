"use strict";

const BaseQuery = require('../Helpers/SqlHelper');
class Tagline extends BaseQuery {

	constructor() {
		super();
		this.table = "taglines";
	}

	async getRandom() {

		let query = `SELECT tagline FROM ${this.table} ORDER BY RAND() LIMIT 1`;
		
		return await this.query(query);
	}
}

module.exports = Tagline;
