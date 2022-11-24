const validator  = require('validatorjs');

module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    signIn: async (req, res, next) => {

        let body = req.body;
        let rules = {};

        rules = {
            social_site: "required|string",
            email: "required|email",
        }

        if (body.social_site === 'desxpert') {
            rules.password = "required|string";
        }
        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }
        
        next();
    },

    /**
     * Create set password validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    setPassword: async (req, res, next) => {
        let body = req.body;
        let rules = {
            password: "required|min:8",
            confirm_password: "required|min:8"
        };


        let validation = new validator(body, rules);
        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });

        }
        if (body.password !== body.confirm_password) {
            return res.json({ status: 422, message: "Password does not match" });
        }

        next();

    },
};
