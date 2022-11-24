const validator = require('validatorjs');

module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    createContract: async (req, res, next) => {
        let body = req.body;

        let rules = {
            client_uuid:"required|string",
            proposal_uuid: "required|string"
        }

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }

};
