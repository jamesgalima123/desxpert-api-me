"use strict"
const JWT = require('jsonwebtoken');
const AUTH_SERVICE = new (require('../Services/AuthService'))();


module.exports = {
	signIn: async (req, res) => {
		try {
            let response = await AUTH_SERVICE.signIn(req.body);
            return res.json(response);                   
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    }
}