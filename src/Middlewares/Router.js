const BODY_PARSER = require('body-parser');
const JWT = require('jsonwebtoken');

module.exports = {

	cors: function (req, res, next) {
	    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
	    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
	    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	    next();
	},

	authenticated: function(req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");

        res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, authorization");

        if (!req.headers.authorization) {

			res.status(401).json({
				"message":"Authorization token is missing"
			});

			return;
		} else {

			let token = req.headers.authorization;
			let tokenKey = process.env.TOKEN_KEY;

			JWT.verify(token, tokenKey, function (err, data) {
				if (err) {		    					    		
					return res.json({successful: false,  message: err });
				}

				return data ? next() : res.json({ "message":"Authentication failed." });		         
			});	    		
		}
    },
   
    useStandard: function(APP) {
    	APP.use(BODY_PARSER.json({strict: false}));
		APP.use(BODY_PARSER.urlencoded({extended: true}));    
		APP.use(this.cors)
    },

    useAuthenticated: function(APP) {
    	APP.use(BODY_PARSER.json({strict: false}));
		APP.use(BODY_PARSER.urlencoded({extended: true}));
    	APP.use(this.authenticated)
    }

}
