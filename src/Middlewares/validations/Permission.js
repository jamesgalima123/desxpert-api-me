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
            module_id: "required|numeric",
            permission: "required|string",
            description: "required|string"
        }

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    },
    update: async (req, res, next) => {
        let body = req.body;
        let params = req.params;
        let rules = {
            module_id: "required|numeric",
            permission: "required|string",
            description: "required|string"
        }
        if (!params.id) {
            return res.json({ status: 422, message: "ID is required" });
        }
        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }

};
