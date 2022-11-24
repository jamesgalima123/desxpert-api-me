"use strict"

const BaseQuery = require('../Helpers/SqlHelper');

class Professional extends BaseQuery {

    constructor() {
        super();
        this.table = "professionals";
    }
}

module.exports = Professional;