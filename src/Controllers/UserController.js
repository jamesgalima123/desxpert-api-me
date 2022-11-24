"use strict"

const USER_SERVICE = new (require('../Services/UserService'))();
const { json } = require('express/lib/response');
const JWT = require("jsonwebtoken");
let bill = 0;
module.exports = {

	all: async (req, res) => {

		try {

			let response = await USER_SERVICE.all();

			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
	},
	getUserProfilePicture: async(req,res)=>{
		try {
			let response = await USER_SERVICE.getUserProfilePicture(req);
			console.log(response);
			return res.end(response);
		} catch (err) {
			return res.json({ status: 500, message: err });
		}
	},
	get: async (req, res) => {

		try {

			let response = await USER_SERVICE.get(req.params.id);

			return res.json(response);

		} catch (err) {

			return res.json({ status: 500, message: err });
		}
	},

	create: async (req, res) => {

		try {

			let response = await USER_SERVICE.create(req.body);

			if (response.status !== 404) {
				delete response.data.salt;
				delete response.data.password;
				delete response.data.id;
			}

			return res.json(response);

		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}
	},

	verify: async (req, res) => {

		try {

			let verification = await USER_SERVICE.verify(req);
			if (verification.status == 200) {
				let user = verification.data[0].user;
				let secretToken = {
					userId: user.id,
					uuid: user.uuid,
					username: user.username,
					email: user.email,
					status: user.status,
					displayName: user.display_name
				};
				let options = { expiresIn: (60 * parseInt(process.env.TOKEN_EXPIRATION)) }
				let token = JWT.sign(secretToken, process.env.TOKEN_KEY, options);
				verification.data[0].accessToken = token;
				delete verification.data[0].user;
			}
			return res.json(verification);

		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}
	},
	setPassword: async (req, res) => {

		try {

			let user = await USER_SERVICE.setPassword(req.headers, req.body);
			return res.json(user);
		} catch (err) {
			console.log("error " + err);
			return res.json({ status: 500, message: err });
		}

	},
	update: async (req, res) => {

		try {

			let user = await USER_SERVICE.update(req);
			return res.json({ user });
		} catch (err) {
			return res.json({ status: 500, message: err });
		}

	},
	requestResetPassword: async (req, res) => {
		try {
			let user = await USER_SERVICE.requestResetPassword(req);
			return res.json({ user });
		} catch (err) {
			return res.json({ status: 500, message: err });
		}
	}
}
