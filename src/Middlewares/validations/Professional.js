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
    register: async (req, res, next) => {
        let body = req.body;
        // global rules regardless of social site
        let generalRules = {
            social_site: "required|string"
        }

        let generalValidation = new validator(body, generalRules);
        if (generalValidation.fails()) {
            return res.json({ status: 422, message: generalValidation.errors.all(), ...generalValidation.errors });
        }
        // rules for registration via google
        if (body.social_site === "google"){
            let googleRules = {
                access_token: "required|string",
                email: "required|email"
            };
            let googleValidation = new validator(body, googleRules);
            if(googleValidation.fails()){
                return res.json({ status: 422, message: googleValidation.errors.all(), ...googleValidation.errors });
            }
        } else if (body.social_site === 'facebook') {
            let facebookRules = {
                access_token: "required|string",
                email: "required|email",
                userId: "required|string",
            };
            let facebookValidation = new validator(body, facebookRules);
            if(facebookValidation.fails()){
                return res.json({ status: 422, message: facebookValidation.errors.all(), ...facebookValidation.errors });
            }
        } else {
            // rules for registration via email
            let emailRules = {
                first_name: "required|string",
                last_name: "required|string",
                email: "required|email",
                username: "required|string",
                middle_name: "string",
                social_site: "required|string"
            }
    
            let emailValidation = new validator(body, emailRules);
            if (emailValidation.fails()) {
                return res.json({ status: 422, message: emailValidation.errors.all(), ...emailValidation.errors });
            }
        }

        next();
    },
    save: async (req, res, next) => {
        
    
            let rules = {
                id: "required:integer"
            }
            let rules_user_profile = {
                first_name:"required|string",
                middle_name:"required|string",
                last_name:"required|string",
                gender: "string",
                birthday: "required|date",
                brgy: "string",
                city: "string",
                state: "string",
                country: "string",
                zip_code: "string",
                current_address: "string",
            }
            let rules_professional = {
                profession_id: "required|integer",
                specialty: "string",
                skill_description: "string",
                bio: "string",
                hmo: "string",
                years_of_experience: "required|integer",
                associated_with: "string",
                show_professional_fee: "required|integer",
                status: "required|string",
                clinic: "string",
                clinic_street_name: "string",
                clinic_country: "required|string",
                clinic_state: "required|string",
                clinic_city: "required|string",
                clinic_zipcode: "string"
            }
            let rules_professional_id = {
                value: "required|string",
            }
      
            let upload =  multer({});
            let professionalFetchValues = upload.fields([{name:"prc_id_selfie",maxCount:1},{name:"prc_id",maxCount:1},{name:"profile_picture",maxCount:1},{name:"signature",maxCount:1}]);
            let img = await professionalFetchValues(req,res,async function(){
                try{
                    
                    let body = JSON.parse(req.body.formValues);
                    let user_profile = body.profile;
                    let professional = body.professional;
                    let professional_id = body.professional_id;
                    let validation = new validator(req.params, rules);
                    let validation_user_profile = new validator(user_profile, rules_user_profile);
                    let validation_professional = new validator(professional, rules_professional);
                    let validation_professional_id = new validator(professional_id, rules_professional_id);
            
                    if (validation.fails()) {
                        console.log(validation.errors);
                        return res.json({ status: 422, message: "User ", ...validation.errors });
                    }
                    if (validation_user_profile.fails()) {
                        console.log(validation_user_profile.errors);
                        return res.json({ status: 422, message: "User Profile ", ...validation_user_profile.errors });
                    }
                    if (validation_professional.fails()) {
                        console.log(validation_professional.errors);
                        return res.json({ status: 422, message: "User Professional ", ...validation_professional.errors });
                    }
                    if (validation_professional_id.fails()) {
                        console.log(validation_professional_id.errors);
                        return res.json({ status: 422, message: "User Professional ID ", ...validation_professional_id.errors });
                    }
           
                    next();
                }catch(error){
                    console.log("img error " + error);
                }
            });
            

    
            
    },
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

    }
}
