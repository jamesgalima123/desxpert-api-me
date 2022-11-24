"use strict"
const fs = require('fs');
const USER = new (require('../Models/User'))();
const EMAIL_SERVICE = new (require('./EmailService'))();
const BCRYPT = require('bcryptjs');
const fetch = require ("node-fetch");
const PROFESSIONAL = new (require('../Models/Professional'))();
const USER_SERVICE = new (require('./UserService'))();
const ROLE_SERVICE = new (require('./RoleService'))();
const PROFESSIONALID_SERVICE = new (require('./ProfessionalIdService'))();
const path = require('path');
const TOOLS = require('../Helpers/Tools');
const JWT = require("jsonwebtoken");
const UserService = require('./UserService');
const PROFESSIONAL_OFFICE_SERVICE = new (require('./ProfessionalOfficeService'))();

class ProfessionalService {

    async register(body) {
        try {
            
            if (body.social_site === "google") {
                let verifyGoogleToken = await fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+body.access_token);
                let googleUserInfo = await verifyGoogleToken.json();
                body.email = googleUserInfo.email;
                body.first_name = googleUserInfo.given_name;
                body.middle_name = " ";
                body.last_name = typeof googleUserInfo.family_name !== 'undefined' ? googleUserInfo.family_name : '';
                body.email_verified = 1;
                body.username = googleUserInfo.email;
                body.image_url =  typeof googleUserInfo.picture !== 'undefined' ? googleUserInfo.picture : '';
            } else if (body.social_site === 'facebook') {
                let verifyFbToken = await fetch("https://graph.facebook.com/"+body.userId+"?access_token="+body.access_token+"&fields=first_name,last_name,middle_name,gender,picture");
                let facebookUserInfo = await verifyFbToken.json();
                body.email = body.email;
                body.first_name = facebookUserInfo.first_name;
                body.middle_name = typeof facebookUserInfo.middle_name != 'undefined' ? facebookUserInfo.middle_name : '';
                body.last_name = typeof facebookUserInfo.last_name !== 'undefined' ? facebookUserInfo.last_name : '';
                body.email_verified = 1;
                body.username = body.email;
                body.image_url =  typeof facebookUserInfo.picture.data.url !== 'undefined' ? facebookUserInfo.picture.data.url : '';
            }

            let role = await ROLE_SERVICE.getRoleByRoleName("Professional");
            
            body.role_id = role.data.id;
            body.status = "active";
            body.created_by = 0;
            body.type = "Professional";
            let user = await USER_SERVICE.create(body);
            
            let professional = {};
            
            if (user.status === 404) {
                professional = await PROFESSIONAL.get({ user_id: user.data.id });
                if (professional.status !== 'pending') {
                    return user;
                }
            } else {
                professional = await PROFESSIONAL.create({ user_id: user.data.user_id, status: "pending" });
            }

            let secretToken = {
                userId: user.data.id,
                username: user.data.username,
                email: user.data.email,
                status: user.data.status,
                displayName: user.data.display_name
            };
            let options = { expiresIn: (60 * parseInt(process.env.TOKEN_EXPIRATION)) }
            professional.accessToken = await JWT.sign(secretToken, process.env.TOKEN_KEY, options);
            return { 
                status: 200, 
                data: professional, 
                message: body.social_site === 'desxpert' ?
                    "Verification link has been sent your email. Please verify your email address."
                    :
                    "Registration Successful"
            };
        } catch (error) {
            return { status: 500, message: err };
        }
    }

    async save(req) {
        try {
            
            let body = JSON.parse(req.body.formValues);
            req.body = body;

            let params = req.params;
            let prcIdSelfie = req.files['prc_id_selfie'][0];
            let prcId = req.files['prc_id'][0];
            let profilePicture = req.files['profile_picture'][0];
            let signature = req.files['signature'][0];

            body.profile.birthday = new Date(body.profile.birthday);
            body.professional.has_applied = true;

            let professional = await PROFESSIONAL.get({ user_id: params.id });
            if (!professional) {
                return { status: 404, message: "Professional does not exist" };
            }
            if (professional.has_applied) {
                return { status: 500, message: "Professional has already applied" };
            }

            let professionalId = professional.id;
            req.body.professional_id.professional_id = professionalId;
            req.body.professional_id.type = "PRC";
            
            await PROFESSIONAL.update(body.professional, { user_id: params.id });
            
            let user = await USER_SERVICE.get(params.id);

            if (!user) {
                return { status: 404, message: "User does not exist" };
            }
            let pictureDest = "./uploads/" + user.data.id + "/";
            let profilePicFileName = profilePicture.fieldname + ".jpg";
            let prcIdFileName = prcId.fieldname + ".jpg";
            let prcIdSelfieFileName = prcIdSelfie.fieldname + ".jpg";
            let signatureFileName = signature.fieldname + ".jpg";

            if (!fs.existsSync(pictureDest)){
                fs.mkdirSync(pictureDest, { recursive: true });
            }
            
            await fs.createWriteStream(pictureDest + profilePicFileName).write(profilePicture.buffer);
            await fs.createWriteStream(pictureDest + prcIdFileName).write(prcId.buffer);
            await fs.createWriteStream(pictureDest + prcIdSelfieFileName).write(prcIdSelfie.buffer);
            await fs.createWriteStream(pictureDest + signatureFileName).write(signature.buffer);

            const rootDir = path.resolve("./");

            let professionalIdDir = pictureDest + prcIdFileName;
            req.body.professional_id.link = rootDir + professionalIdDir.substring(1,professionalIdDir.length);
            await PROFESSIONALID_SERVICE.create(req.body.professional_id);

            let professionalIdSelfieDir = pictureDest + prcIdSelfieFileName;
            req.body.professional_id_selfie = {link:"",type:"selfie"};
            req.body.professional_id_selfie.professional_id = professionalId;
            req.body.professional_id_selfie.link = rootDir + professionalIdDir.substring(1,professionalIdSelfieDir.length);
            await PROFESSIONALID_SERVICE.create(req.body.professional_id_selfie);

            let professional_signature_dir = pictureDest + signatureFileName;
            req.body.signature = {link:"",type:"signature"};
            req.body.signature.professional_id = professionalId;
            req.body.signature.link = rootDir + professionalIdDir.substring(1,professional_signature_dir.length);
            await PROFESSIONALID_SERVICE.create(req.body.signature);

            let profilePictureDir = pictureDest + profilePicFileName;
            req.body.profile.image_url = process.env.APP_CONN + "://" + process.env.APP_URL + ":" + process.env.APP_PORT  + "/user-pictures/profile-picture/" + user.data.id; 
            console.log("user image url " + req.body.profile.image_url);
            await USER_SERVICE.update(req);

            let professionalOffice = {
                professional_id: professionalId,
                street_name: body.professional.clinic_street_name,
                country: body.professional.clinic_country,
                state: body.professional.clinic_state,
                city: body.professional.clinic_city,
                zip_code: body.professional.clinic_zipcode,
                name: body.professional.clinic             
            }

            await PROFESSIONAL_OFFICE_SERVICE.create(professionalOffice);

            let emailPayload = {
                first_name: user.data.profile.first_name
            }   
            await EMAIL_SERVICE.sendProfessionalApplicationConfirmation(user.data.email, emailPayload);

            let profRes = { status: 200, message: "The professional details has been saved" };
            
            return { professional: profRes };    
            
            
        } catch (error) {
            console.log("error saving professional === " + error);
            return { status: 500, message: error };
        }
    }
    async getProfessionalPicture(req){
        try {
            const rootDir = path.resolve("./");
            let imageDir = "";
            switch(req.params.type){
                case 'prc-id':
                    imageDir = rootDir + "/uploads/" + req.params.id + "/prc_id.jpg";
                    break;
                case 'prc-id-selfie':
                    imageDir = rootDir + "/uploads/" + req.params.id + "/prc_id_selfie.jpg";
                    break;
                    case 'signature':
                        imageDir = rootDir + "/uploads/" + req.params.id + "/signature.jpg";
                        break;
                default:
                    return { status: 404, message: "Type does not exist" };
                
            }
            let image = null;
            image = await TOOLS.getImage(imageDir);
            return image;

        } catch (err) {
            return { status: 500, message: err };

        }
    }
    async getProfessional(userId){
        try{
            let professional = await PROFESSIONAL.get({ user_id:userId });
            if(!professional){
                return { status: 404, message: "Professional does not exist" };
            }
            return { status: 200, data: professional};

        }catch(err){
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
    async initialSetPassword(body){
        try {
            let isp = body.isp;
            let email = new Buffer(isp,'base64').toString();
            console.log("the email " + email);
            let user = await USER.get({ email: email });
            if (!user) {
                return { status: 404, message: "Email does not exist" };
            }
            let role = await ROLE_SERVICE.getRoleByRoleName("Professional");
            if(role.data.id != user.role_id){
                return { status: 404, message: "Professional does not exist" };
            }
            let salt = await BCRYPT.genSalt(8);
            let password = await BCRYPT.hash(body.password + salt, 10);
            await USER.update({ password: password, salt: salt}, { email: email });
            return { status: 200, message: "Password set successfully" };

        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }
}

module.exports = ProfessionalService;
