"use strict"

const BCRYPT = require('bcryptjs');
const USER = new (require('../Models/User'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();
const ROLE_SERVICE = new (require('./RoleService'))();
const PROFESSIONAL_SERVICE = new (require('./ProfessionalService'))();
const ENV = process.env;
const JWT = require("jsonwebtoken");
class AuthService  {

	async signIn(body) {       
        
        try {
            let social_site = body.social_site;

            let user = await USER.get({'email' : body.email, 'app_id' : ENV.APP_ID});
        
            if (!user || user.social_site !== social_site) {
                return { status: 404, message: "Account doesn't exist"  };
            }                   

            if (social_site === 'desxpert' && user.password !== null) {
                
                let validatePassword = await BCRYPT.compare((body.password + user.salt), user.password);

                if (!validatePassword) {
                    return { status: 401, message:"Incorrect email and password" };
                }
            }

            if (!user.status) {
                return { status: 401, message:"Your account is locked. Please contact your administrator." };
            }

            let userProfile = await USER_PROFILE.get({ user_id: user.id });
            
            if (!userProfile) {
                return { status: 404, message: "User profile does not exist" };

            }

            let userRole = await ROLE_SERVICE.get(user.role_id);
            let secretToken = {};
            
            if (userRole.data.role === "Professional") {
                let professionalResponse = await PROFESSIONAL_SERVICE.getProfessional(user.id);
                if (professionalResponse.status == 200) {
                    if(user.verified < 1 || professionalResponse.data.status !== 'approved') {
                        let professionalApplicationToken = "";
                        if (professionalResponse.data.has_applied < 1 && professionalResponse.data.status === 'pending') {
                            secretToken = {
                                userId: user.id,
                                username: user.username,
                                email: user.email,
                                status: user.status,
                                displayName: user.display_name
                            };
                            let options = { expiresIn: (60 * parseInt(process.env.TOKEN_EXPIRATION)) }
                            professionalApplicationToken = await JWT.sign(secretToken, process.env.TOKEN_KEY, options);
                        }
                        return { 
                            status: 100, 
                            message: user.verified < 1 ? "Account not yet verified" : 
                                    professionalResponse.data.has_applied > 0 ? 
                                    professionalResponse.data.status === 'declined' ? 
                                    "Application status: Declined" : 
                                    "Application status: For Review" : 
                                    "Kindly complete your application",
                            data: professionalResponse.data.has_applied < 1 ? professionalApplicationToken : ""
                        };
                    }
                    let professional = professionalResponse.data;
                    secretToken = {
                        uuid: user.uuid,
                        username: user.username,
                        email: user.email,
                        role: userRole.data.role,
                        status: user.status,
                        verified: user.verified,
                        display_name: user.display_name,
                        social_site: user.social_site,
                        first_name: userProfile.first_name,
                        middle_name: userProfile.middle_name,
                        last_name: userProfile.last_name,
                        gender: userProfile.gender,
                        birthday: userProfile.birthday,
                        mobile_number: userProfile.mobile_number,
                        brgy: userProfile.brgy,
                        city: userProfile.city,
                        state: userProfile.state,
                        country: userProfile.country,
                        zip_code: userProfile.zip_code,
                        current_address: userProfile.current_address,
                        image_url: userProfile.image_url,
                        profession_id: professional.profession_id,
                        specialty: professional.specialty,
                        has_applied: professional.has_applied,
                        skill_description: professional.skill_description,
                        bio: professional.bio,
                        hmo: professional.hmo,
                        years_of_experience: professional.years_of_experience,
                        associated_with: professional.associated_with,
                        show_professional_fee: professional.show_professional_fee,
                        application_status: professional.status,
                        date_of_admission: professional.date_of_admission,
                        clinic: professional.clinic,
                        clinic_street_name: professional.clinic_street_name,
                        clinic_country: professional.clinic_country,
                        clinic_state: professional.clinic_state,
                        clinic_city: professional.clinic_city,
                        clinic_zipcode: professional.clinic_zipcode
                    };		
                } else {
                    return professionalResponse;
                }
            } else {
                secretToken = {
                    uuid: user.uuid,
                    username: user.username,
                    email: user.email,
                    role: userRole.data.role,
                    status: user.status,
                    verified: user.verified,
                    display_name: user.display_name,
                    social_site: user.social_site,
                    first_name: userProfile.first_name,
                    middle_name: userProfile.middle_name,
                    last_name: userProfile.last_name,
                    gender: userProfile.gender,
                    birthday: userProfile.birthday,
                    mobile_number: userProfile.mobile_number,
                    brgy: userProfile.brgy,
                    city: userProfile.city,
                    state: userProfile.state,
                    country: userProfile.country,
                    zip_code: userProfile.zip_code,
                    current_address: userProfile.current_address,
                    image_url: userProfile.image_url
                };	
            }

            					
            let options = { expiresIn: (60 * parseInt(process.env.TOKEN_EXPIRATION)) }
            let token 	= JWT.sign(secretToken, process.env.TOKEN_KEY, options);	
            let response = { 
                status: 200, 
                data: {
                    type: "users", 
                    id: user.id, 
                    attributes: {
                        accessToken: token,                                
                    }
                },
                message: "Login Successful"
            }
            return response;

        } catch (err) {
            console.log('ERROR SIGN IN == ', err)
            return { status: 500, message: err };
        }
        
    }
  
}

module.exports = AuthService;