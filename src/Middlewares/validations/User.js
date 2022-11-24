const validator = require('validatorjs');
const JWT = require("jsonwebtoken");
const USER_SERVICE = new (require('../../Services/UserService'))();
const ROLE_SERVICE = new (require('../../Services/RoleService'))();


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
        let rules = { role_id: "required|integer" };

        if (body.role_id == 1) {

            rules = {
                email: "required|email",
                first_name: "required|string",
                middle_name: "required|string",
                last_name: "required|string",
                status: "required",
                username: "required"
            }
        }


        let validation = new validator(body, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    },


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

    update: async (req, res, next) => {

        let token = req.headers.authorization;
        var decodedToken = JWT.decode(token);
        let params = req.params;

        if (params.id != decodedToken.userId) {

            let requestor = await USER_SERVICE.get(decodedToken.userId);
            let requestorRole = await ROLE_SERVICE.get(requestor.role_id);

            if (requestorRole.data.role.toLowerCase() != "admin") {
                return res.json({ status: 403, message: "You are not allowed to perform this action" });
            }
        }

        next();

    },
    requestResetPassword: async (req, res, next) => {
        let body = req.body;
        rules = {
            email: "required|email"
        }
        let validation = new validator(body, rules);
        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }
        next();
    }
};
