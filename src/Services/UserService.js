"use strict";
const { v4: UUID_V4 } = require('uuid')
const BCRYPT = require('bcryptjs');
const USER = new (require('../Models/User'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();
const EMAIL_VERIFICATION = new (require('../Models/EmailVerification'))();
const EMAIL_SERVICE = new (require('./EmailService'))();
const JWT = require("jsonwebtoken");
const { getDiffInDays } = require('../Helpers/Tools');
const path = require('path');
const TOOLS = require('../Helpers/Tools');
class UserService {

    async defaultProperties(body) {

        let payload = {};

        payload.user = {
            role_id: body.role_id,
            status: body.status,
            email: body.email,
            username: body.username,
            verified: typeof body.email_verified !== 'undefined' ? body.email_verified : 0,
            salt: null,
            password: null,
            display_name: 'full',
            uuid: body.uuid,
            app_id: process.env.APP_ID,
            created_by:body.created_by,
            social_site: body.social_site
        };

        payload.profile = {
            first_name: body.first_name,
            middle_name: body.middle_name,
            last_name: body.last_name,
            mobile_number: body.mobile_number,
            image_url: typeof body.image_url !== 'undefined' ? body.image_url : ''
        };

        return payload;
    }

    async all() {

        try {

            let users = await USER.getBasicInfo();

            return { status: 200, data: users, message: "Data retrieved." };

        } catch (err) {
            console.log("error " + err);

            return { status: 500, message: err };
        }
    }

    async get(userId) {

        try {

            let user = await USER.get({ id: userId });

            if (!user) {
                return { status: 404, message: "User does not exists" };
            }

            user.profile = await USER_PROFILE.get({ user_id: userId })

            return { status: 200, data: user, message: "Data retrieved" };

        } catch (err) {
            console.log("error " + err);

            return { status: 500, message: err };
        }
    }

    async verify(req) {
        try {
            let verificationCode = req.params.verification_code;
          
            let verification = await EMAIL_VERIFICATION.get({ verification_code: verificationCode });
            let isValid = true;

            if (!verification) {
                let vcode = req.headers.vcode;

                if (vcode === "") {
                    return { status: 404, message: "Verification code not found" };
                }
                console.log("the vcode " + vcode);

                vcode = vcode.split("").reverse().join("");

                let userEmail = Buffer(vcode, 'base64').toString('ascii');

                let checkUser = await USER.get({ email: userEmail});
                if (!checkUser) {
                    return { status: 404, message: "Verification code not found" };
                }
                if (checkUser.verified < 1 || checkUser.password !== null) {
                    return { status: 404, message: "Verification code not found" };
                }

                return { status: 200, data: [{ status: "verified", email: checkUser.email, user: checkUser }] };

            } else {
                let user = await USER.get({ id: verification.user_id });

                if(!user.verified){
                    let dateCreated = new Date(verification.created_at);
                    let currentDate = new Date();
                    let diffInDays = getDiffInDays(currentDate, dateCreated);
    
                    if (diffInDays >= 3) {
                        isValid = false;
                        
                        await EMAIL_VERIFICATION.delete({ verification_code: verificationCode }, false);
                    } else {

                        if (user.password !== "") {
                            await EMAIL_VERIFICATION.delete({ verification_code: verificationCode }, false);
                        }

                        if (user.verified < 1) {
                            await USER.update({ verified:1 },{ id:user.id });
                        }
                    }
                }
                

                if (isValid) {
                    return { status: 200, data: [{ "status": "verified", "email": user.email, user: user }] };
                } else {
                    return { status: 404, message: "Verification code has expired" };
                }
            }
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }

    async create(body) {
        const type = body.type;
        console.log("the type " + type);
        try {
            let isExist = await USER.get({ email: body.email });
            if (isExist) {
                return { status: 404, message: "Creation Unsuccessful. User already exists.", data: isExist};
            }
            const uuid = UUID_V4();
            body.uuid = uuid;
            let payload = await this.defaultProperties(body);

            let user = await USER.create(payload.user);

            payload.profile.user_id = user.id;

            let profile = await USER_PROFILE.create(payload.profile,false);

            let response = { ...user, ...profile };
            
            let verificationLink = BCRYPT.genSaltSync(10);
            verificationLink = verificationLink.replaceAll("/", '');

            if (payload.user.social_site === 'desxpert') {
                const date = new Date();
                date.setDate(date.getDate() + 3);
                await EMAIL_VERIFICATION.create({ user_id: user.id, verification_code: verificationLink, expire_at: date })

                let emailPayload = {
                    first_name: profile.first_name,
                    link: verificationLink
                }
                if (type === "Professional") {
                    let vcode = Buffer.from(user.email).toString('base64');
                    emailPayload.vcode = vcode.split("").reverse().join("");
                    await EMAIL_SERVICE.sendEmail(user.email, emailPayload);
                } else {
                    let isp = Buffer.from(user.uuid).toString('base64');
                    emailPayload.isp = isp;
                    await EMAIL_SERVICE.sendEmailClient(user.email, emailPayload);

                }
            }

            return { status: 200, data: response, message: "Success! The new user has been created." };

        } catch (err) {
            console.log("errorr " + err);
            return { status: 500, message: err };
        }
    }

    async setPassword(headers, body) {
        try {
            let token = headers.authorization;
            let decodedToken = JWT.decode(token);
            console.log('TOKEN', decodedToken)
            let user = await USER.get({ uuid: decodedToken.uuid });
            if (!user) {
                return { status: 404, message: "Account does not exist" };
            }
            if (user.id === decodedToken.userId) {
                let salt = await BCRYPT.genSalt(8);
                let password = await BCRYPT.hash(body.password + salt, 10);
                await USER.update({ password: password, salt: salt  }, { email: decodedToken.email });
                return { status: 200, message: "Password set successfully" };

            } else {
                return { status: 404, message: "Account does not exist" };
            }

        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }

    async update(req) {

        let body = req.body;
        let params = req.params;

        try {

            let user = await USER.get({ id: params.id });

            if (!user) {
                return { status: 404, message: "Update Unsuccessful. User does not exist." };
            }

            if (body.user) {
                delete body.user.username;
                delete body.user.email;
                delete body.user.salt;
                delete body.user.password;
                await USER.update(body.user, { id: user.id });
            }

            await USER_PROFILE.update(body.profile, { user_id: user.id });

            return { status: 200, message: "Profile updated successfully" };
        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }
    }

    async requestResetPassword(req) {

        let body = req.body;
        try {
            let user = await USER.get({ email: body.email });
            if (!user) {
                return { status: 404, message: "Email is not registered" };
            }
            let verificationLink = BCRYPT.genSaltSync(10);
            await EMAIL_VERIFICATION.create({ user_id: user.id, verification_code: verificationLink });
            let profile = await USER_PROFILE.get({ user_id: user.user_id });
            let emailPayload = {
                first_name: profile.first_name,
                link: verificationLink
            }
            await USER.update({ forgot_password: 1 }, { id: user.id });
            await EMAIL_SERVICE.sendResetPasswordEmail(user.email, emailPayload);

            return { status: 200, message: "The reset password link has been sent." };
        } catch (err) {
            return { status: 500, message: err };
        }
    }
    async getUserProfilePicture(req){
        try {
            const rootDir = path.resolve("./");
            const imageDir = rootDir + "/uploads/" + req.params.id + "/profile_picture.jpg";
            let image = null;
            console.log(image);
            image = await TOOLS.getImage(imageDir);
            return image;

        } catch (err) {
            return { status: 500, message: err };

        }
    }
}

module.exports = UserService;
