const validator = require('validatorjs');

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

        let rules = {
            name: "required|string",
            parent_id: "required|numeric",
            color_hex: "required|string",
            salutation: "required|string"
        }

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }, update: async (req, res, next) => {
        let body = req.body;

        let rules = {
            name: "required|string",
            color_hex: "required|string",
            salutation: "required|string"
        }

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }
};
