const validator = require('validatorjs');
const multer  = require('multer');

module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
     initialSetPassword: async (req, res, next) => {
        let body = req.body;
        let rules = {
            isp:"required|string",
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
    register: async (req, res, next) => {
        
        let body = req.body;
        
        let rules = {
            email: "required|email",
            social_site: "required|string"
        }

        if (body.social_site === 'google') {
            rules.access_token = "required|string"
        } else if (body.social_site === 'facebook') {
            rules.userId = "required|string"
            rules.access_token = "required|string"
        } else {
            rules.first_name = "required|string"
            rules.last_name = "required|string"
            rules.middle_name = "string"
            rules.username = "required|string"
        }

        let validations = new validator(body, rules);
        if (validations.fails()) {
            return res.json({ status: 422, message: validations.errors.all(), ...validations.errors });
        }
        next();
    }
}
