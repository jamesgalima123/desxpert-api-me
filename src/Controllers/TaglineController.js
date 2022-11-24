"use strict"

const TAGLINE_SERVICE = new (require('../Services/TaglineService'))();

module.exports = {

	create: async (req, res) => {

		try {

			let response = await TAGLINE_SERVICE.create(req.body);

			return res.json(response);

		} catch (err) {
			return res.json({ status: 500, message: err });
		}
	},

	getRandom: async (req, res) => {

		try {

			let response = await TAGLINE_SERVICE.getRandom();

			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
	},
	get: async (req, res) => {

		try {

			let response = await TAGLINE_SERVICE.get(req);

			return res.json(response);

		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}
	},
	update: async (req, res) => {

		try {

			let response = await TAGLINE_SERVICE.update(req);

			return res.json(response);

		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}
	},
}
