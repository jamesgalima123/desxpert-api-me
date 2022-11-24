"use strict"
const JWT = require('jsonwebtoken');
const PROFESSIONAL_SERVICE = new (require('../Services/ProfessionalService'))();


module.exports = {

    register: async (req, res) => {

        try {
            let response = await PROFESSIONAL_SERVICE.register(req.body);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    getProfessionalPicture: async (req, res) => {

        try {
            let response = await PROFESSIONAL_SERVICE.getProfessionalPicture(req);
            if(response.status){
                return res.json({ response });
            }
            return res.end(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    save: async (req, res) => {

        try {
            let response = await PROFESSIONAL_SERVICE.save(req);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    },
    initialSetPassword: async (req, res) => {

		try {

			let user = await PROFESSIONAL_SERVICE.initialSetPassword(req.body);
			return res.json(user);
		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}

	}
}
