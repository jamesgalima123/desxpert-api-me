"use strict";

const ROLE_SERVICE = new (require("../Services/RoleService"))();

module.exports = {
  	all: async (req, res) => {

    	try {

      		let response = await ROLE_SERVICE.all();

      		return res.json(response);

    	} catch (err) {

      		return res.json({ status: 500, message: err });
    	}
  	},

	get: async (req, res) => {       

		try {			

			let response = await ROLE_SERVICE.get(req.params.id);        

			return res.json(response);                   						

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
	},

  	create: async (req, res) => {

		try {

			let response = await ROLE_SERVICE.create(req.body);

			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
  	},

  	update: async (req, res) => {

		try {

			let response = await ROLE_SERVICE.update(req.body, req.params.id);

			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
  	},

	delete: async (req, res) => {
		
		try {

			let response = await ROLE_SERVICE.delete(req.params.id);
			
			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
	},
};
