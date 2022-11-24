const validator = require('validatorjs');
const JWT = require("jsonwebtoken");


module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    create: async (req, res, next) => {
        let body = req.body;
        let rules = { tagline: "required|string" };

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    },
    update: async (req, res, next) => {
        let body = req.body;
        let rules = { tagline: "required|string" };

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }

};
