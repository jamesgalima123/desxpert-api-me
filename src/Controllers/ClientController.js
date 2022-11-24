"use strict"
const CLIENT_SERVICE = new (require('../Services/ClientService'))();


module.exports = {
    initialSetPassword: async (req, res) => {

		try {

			let user = await CLIENT_SERVICE.initialSetPassword(req.body);
			return res.json(user);
		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}

	},
	register: async (req, res) => {

        try {
            let response = await CLIENT_SERVICE.register(req.body);
            return res.json(response);
        } catch (err) {
            return res.json({ status: 500, message: err });
        }
    }
}
