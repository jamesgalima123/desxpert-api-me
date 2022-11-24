"use strict"
const fs = require('fs');
const fetch = require ("node-fetch");
const USER = new (require('../Models/User'))();
const ROLE_SERVICE = new (require('./RoleService'))();
const USER_SERVICE = new (require('./UserService'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();
const BCRYPT = require('bcryptjs');
const JWT = require("jsonwebtoken");

class ClientService {
    async initialSetPassword(body){
        try {
            let isp = body.isp;
            console.log("the isp " + isp);
            let email = new Buffer(isp,'base64').toString();
            console.log("the email " + email);
            let user = await USER.get({ email: email });
            if (!user) {
                return { status: 404, message: "Email does not exist" };
            }
            let role = await ROLE_SERVICE.getRoleByRoleName("Client");
            if(role.data.id != user.role_id){
                return { status: 404, message: "Client does not exist" };
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
    async register(body) {
        try {
            let role = await ROLE_SERVICE.getRoleByRoleName("Client");
            if(role.status != 200){
                return role;
            }

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

            body.role_id = role.data.id;
            body.status = "active";
            body.created_by = 0;
            body.type = "Client";
            let user = await USER_SERVICE.create(body);     
            if (user.status === 404) {
                return user;
            }
            if (body.social_site !== 'desxpert') {
                let userProfile = await USER_PROFILE.get({ user_id: user.data.id });
                if (!userProfile) {
                    return { status: 404, message: "User profile does not exist" };

                }
                let secretToken = {
                    uuid: user.data.uuid,
                    username: user.data.username,
                    email: user.data.email,
                    role: role.data.role,
                    status: user.data.status,
                    verified: user.data.verified,
                    display_name: user.data.display_name,
                    social_site: user.data.social_site,
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
                let options = { expiresIn: (60 * parseInt(process.env.TOKEN_EXPIRATION)) }
                user.accessToken = JWT.sign(secretToken, process.env.TOKEN_KEY, options);
                console.log(secretToken);
            }
            return { 
                status: 200, 
                data: user, 
                message: "Verification link has been sent your email. Please verify your email address."
            };
        } catch (err) {
            console.log("error " + err);
            return { status: 500, messager: err.toString() };
        }
    }
    


}

module.exports = ClientService;
