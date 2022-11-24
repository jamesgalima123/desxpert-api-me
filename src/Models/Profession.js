"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Profession extends BaseQuery {

    constructor() {
        super();
        this.table = "professions";
    }
}

module.exports = Profession;