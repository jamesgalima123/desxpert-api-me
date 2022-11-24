"use strict"

const SCHEDULE_SERVICE = new (require('../Services/ScheduleService'))();
const { json } = require('express/lib/response');
let bill = 0;
module.exports = {

	

	create: async (req, res) => {

		try {

			let response = await SCHEDULE_SERVICE.create(req.body);


			return res.json(response);

		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}
	}
}
