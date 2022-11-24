const validator = require('validatorjs');

module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    createProposal: async (req, res, next) => {
        let body = req.body;

        let rules = {
            professional_uuid: "required|string",
            booking_uuid: "required|string",
            fee:"required|numeric"
        }

        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }

};
