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
    sendBooking: async (req, res, next) => {
        let body = req.body;

        let rules = {
            client_uuid: "required|string",
            profession_id: "required|numeric",
            specialty: "required|numeric",
            concern: "required|string",
            type: "required|string"
        
        }
        let upload =  multer({});
        let bookingFetchValues = upload.fields([{name:"attachments",maxCount:3}]);
        bookingFetchValues(req,res, async function(){
            try{
                let validation = new validator(req.body, rules);
                if (validation.fails()) {
                    return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
                }
                next();
            }catch(error){
                console.log("img error " + error);
            }
        });
        

    },
    getBooking: async (req, res, next) => {
        let params = req.params;

        let rules = {
            professional_uuid: "required|string",
            uuid: "required|string"
        }

        let validation = new validator(params, rules);

        if (validation.fails()) {
            return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
        }

        next();
    }

};
