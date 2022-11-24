"use strict"

const NODEMAILER = require('nodemailer');
const TOOLS = require('../Helpers/Tools');
class EmailService {

    async emailSender() {
        var transporter = NODEMAILER.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        return transporter;
    }
    async professionalApplicationConfirmation(payload) {


        let body = {
            subject: 'Registration  Submitted | DESXPERT',
            html: `
                <body style="text-align: center; background: #f2f3f8; font-size: 1rem; padding: 3em">

                    <div style="background-color: white; margin: auto; max-width: 30em; padding: 2em">
                    <a href="{ link }">
                            <img style="max-width: 8rem;" src="https://desxpert-dev.keyzardworks.online/_next/image?url=%2Fimg%2Flogos%2Flogo-square.png&w=384&q=75" alt="logo">
                        </a>
                        <p style="font-size: 2rem; margin: 0">Professional Application</p>
                        <div style="background-color: #919191; padding: .01em; width: 70%; margin: 1.5em auto;"></div>
                        <div style="text-align: left;">
                        <p>Hi ${payload.first_name},</p>
                        <p>Thank you for signing up! </p>
                        <p>You have successfully submitted your application to the Desxpert App. Please wait within 24 hours for us to review your application. </p>
                        <P></p>
                        <P>This is a system generated email. Please  do not reply.</p>
                        <P>You may contact us here at support@desxpert.com should you have any concerns.</p>
                        <p>Thanks,</p>
                        <p>Desxpert</p>

                        </div>
                    </div>
                </body>
            `
        }

        return body;
    }
    async emailVerification(payload) {

        let link = process.env.FRONTEND_URL + '/application/professional?link=' + payload.link+'&vc='+payload.vcode;

        let body = {
            subject: 'Email Account Activation! | DESXPERT',
            html: `
                <body style="text-align: center; background: #f2f3f8; font-size: 1rem; padding: 3em">
                    <div style="background-color: white; margin: auto; max-width: 30em; padding: 2em">
                    <a href="{ link }">
                            <img style="max-width: 8rem;" src="https://desxpert-dev.keyzardworks.online/_next/image?url=%2Fimg%2Flogos%2Flogo-square.png&w=384&q=75" alt="logo">
                        </a>
                        <p style="font-size: 2rem; margin: 0">Email Account Activation!</p>
                        <div style="background-color: #919191; padding: .01em; width: 70%; margin: 1.5em auto;"></div>
                        <div style="text-align: left;">
                        <p>Hi ${payload.first_name},</p>
                        <p>Thank you for signing up! </p>
                        <p>To continue with your application, please do the following: </p>
                        <ol>
                            <li>Verify your email address.</li>
                            <div style="text-align:left; margin: 2rem">
                                <a style="background-color: #9ac45f; padding: 1em 2em; border-radius: .3em; cursor: pointer; text-decoration: none; color: white; font-weight: 400;" href="${link}">Click here to verify email</a>
                            </div>
                            <li>Complete your application form.</li>
                        </ol>
                        <p>Sincerely,</p>
                        <p>Desxpert</p>

                        </div>
                    </div>
                </body>
            `
        }

        return body;
    }
    async emailVerificationClient(payload) {

        let link = process.env.FRONTEND_URL + '/account/set-password?link=' + payload.link + "&isp="+payload.isp;

        let body = {
            subject: 'Your account has been created! | DESXPERT',
            html: `
            <body style="text-align: center; background: #f2f3f8; font-size: 1rem; padding: 3em">
                <header>
                    <a href="{ link }">
                        <img style="max-width: 8rem;" src="https://desxpert-dev.keyzardworks.online/_next/image?url=%2Fimg%2Flogos%2Flogo-square.png&w=384&q=75" alt="logo">
                    </a>
                </header>

                <div style="background-color: white; margin: auto; max-width: 30em; padding: 2em">
                    <p style="font-size: 2rem; margin: 0">Your account has been created!</p>
                    <div style="background-color: #919191; padding: .01em; width: 70%; margin: 1.5em auto;"></div>
                    <div style="text-align: left;">
                    <p>Hi ${payload.first_name},</p>
                    <p>Congratulations! Your account has been created! </p>
                    <p>Use the link below to verify your email address and start using DESXPERT SITE.</p>
                    <div style="text-align:center; margin: 2rem">
                    <a style="background-color: #9ac45f; padding: 1em 2em; border-radius: .3em; cursor: pointer; text-decoration: none; color: white; font-weight: 400;" href="${link}">Click here to verify email</a>
                    </div>
                    
                    
                    
                    <p>Sincerely,</p>
                    <p>Desxpert</p>

                    </div>
                </div>

            </body>
                `
        }

        return body;
    }
    async bookingProfessionalNotification(payload) {

        let link = process.env.FRONTEND_URL + '/booking/view-concern-details?pid=' + payload.professional_uuid + '&bid=' + payload.uuid;
        let body = {
            
            subject: 'New Booking Request',
            html:
            `
            <body style="text-align: center; background: #f2f3f8; font-size: 1rem; padding: 3em">
                    <header>
                        
                    </header>
                    <div style="background-color: white; margin: auto; max-width: 22em; padding: 2em">
                    <a href="{ link }">
                            <img style="max-width: 8rem;" src="https://desxpert-dev.keyzardworks.online/_next/image?url=%2Fimg%2Flogos%2Flogo-square.png&w=384&q=75" alt="logo">
                        </a>
                        <p style="font-size: 2rem; margin: 0">New Booking Request</p>
                        <div style="text-align: left;">
                        <p>Hi ${payload.first_name},</p>
                        <p>From: ${payload.client_first_name + " " + payload.client_last_name} </p>
                        <p style="text-align:justify;">${payload.concern} </p>
                        <div style="text-align:center; margin: 2rem">
                                <a style="background-color: #9ac45f; padding: 1em 2em; border-radius: .3em; cursor: pointer; text-decoration: none; color: white; font-weight: 400;" href="${link}">View Concern</a>
                        </div>
                        <p>Sincerely,</p>
                        <p>Desxpert</p>

                        </div>
                    </div>
                </body>
        `
        }

        return body;
    }
    async resetPasswordVerification(payload) {

        let link = process.env.FRONTEND_URL + '/resetpassword?link=' + payload.link;

        let body = {
            subject: 'Your password reset link! | DESXPERT',
            html: `
                    <h2>Hi ${payload.first_name},</h2>
                    <p>Use the link below to reset your account password.</p>            
                    <br />
                    <p><a href='${link}'>Click here</a></p>
                    <br /><br /><br /><br />
                    <p>Sincerly,</p>
                    <p>Desxpert</p>
                `
        }

        return body;
    }

    async sendResetPasswordEmail(recipient, payload) {

        let body = await this.resetPasswordVerification(payload);
        let html = body.html;

        let mailOptions = TOOLS.mailOptions(recipient, body.subject, html);

        let transporter = await this.emailSender();

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error)
                } else {
                    resolve(info);
                }
            });
        })
    }
    async sendProfessionalApplicationConfirmation(recipient, payload) {
        try {
            let body = await this.professionalApplicationConfirmation(payload);

            let html = body.html;

            let mailOptions = await TOOLS.mailOptions(recipient, body.subject, html);
            let transporter = await this.emailSender();

            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        resolve(info);
                    }
                });
            })
        } catch (err) {

        }
    }
    async sendEmail(recipient, payload) {
        let body = await this.emailVerification(payload);
        let html = body.html;

        let mailOptions = await TOOLS.mailOptions(recipient, body.subject, html);
        let transporter = await this.emailSender();
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            });
        })
    }
    async sendEmailClient(recipient, payload) {
        let body = await this.emailVerificationClient(payload);
        let html = body.html;

        let mailOptions = await TOOLS.mailOptions(recipient, body.subject, html);
        let transporter = await this.emailSender();
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            });
        })
    }
    async sendBookingProfessionalNotification(recipient, payload) {
        let body = await this.bookingProfessionalNotification(payload);
        let html = body.html;

        let mailOptions = await TOOLS.mailOptions(recipient, body.subject, html);
        let transporter = await this.emailSender();
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve(info);
                }
            });
        })
    }  
}


module.exports = EmailService;
