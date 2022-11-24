"use strict"
const JWT = require('jsonwebtoken');
const PROFESSION_SERVICE = new (require('../Services/ProfessionService'))();


module.exports = {

    create: async (req, res) => {

        try {
            let response = await PROFESSION_SERVICE.create(req.body);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    all: async (req, res) => {

        try {
            let response = await PROFESSION_SERVICE.all();
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    get: async (req, res) => {
        try {
            let response = await PROFESSION_SERVICE.get(req.params);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    update: async (req, res) => {
        try {
            let response = await PROFESSION_SERVICE.update(req);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    getByParent: async (req, res) => {
        try {
            let response = await PROFESSION_SERVICE.getByParent(req);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    }
}
