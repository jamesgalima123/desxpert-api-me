"use strict"
const JWT = require('jsonwebtoken');
const PERMISSION_SERVICE = new (require('../Services/PermissionService'))();


module.exports = {

    create: async (req, res) => {

        try {

            let response = await PERMISSION_SERVICE.create(req.body);

            return res.json(response);

        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    all: async (req, res) => {

        try {

            let response = await PERMISSION_SERVICE.all();

            return res.json(response);

        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    update: async (req, res) => {

        try {

            let response = await PERMISSION_SERVICE.update(req);

            return res.json(response);

        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    }
}