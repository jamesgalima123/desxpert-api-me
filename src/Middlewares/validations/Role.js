const validator  = require('validatorjs');

module.exports = {    

    /**
     * validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    create: async (req, res, next) => {
        
        let body = req.body;

        let rules = {	            
            role 	  : "required|string"            
        }
        
        let validation = new validator(body, rules);
		
        if (validation.fails()) {
            return res.json({status: 422, message: "The given data was invalid", ...validation.errors});
        }
        
        next();
    },


    /**
     * validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
     update: async (req, res, next) => {
        
        let body = req.body;

        let rules = {	            
            role 	  : "required|string"            
        }
        
        let validation = new validator(body, rules);
		
        if (validation.fails()) {
            return res.json({status: 422, message: "The given data was invalid", ...validation.errors});
        }
        
        next();
    }
};
