"use strict"
const e = require('express');
const { v4: UUID_V4 } = require('uuid')
const PROFESSIONAL = new (require('../Models/Professional'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();
const USER = new (require('../Models/User'))();
const BOOKING = new (require('../Models/Booking'))();
const CONTRACT = new (require('../Models/Contract'))();
const PROPOSAL = new (require('../Models/Proposal'))();
const EMAIL_SERVICE = new (require('./EmailService'))();
const fs = require('fs');
const supportedMimeTypes = [['image/png','png'],['image/jpeg','jpeg'],['application/pdf','pdf']];
class BookingService {

    async sendBooking(req) {
        let body = req.body;
        let fileExt;
        try {   

            let user = await USER.get( { uuid:body.client_uuid } );

            if(!user){
                return { status: 404, message: "Client does not exist"};
            }

            body.client_id = user.id;
            let booking = await BOOKING.get({ client_id:body.client_id, status: "pending" });

            if(booking){

                await CONTRACT.delete( {booking_id:booking.id} ,false); 
                await PROPOSAL.delete( {booking_uuid:booking.uuid} ,false); 
                await BOOKING.delete( {uuid:booking.uuid} ,false); 
            }
            // if (booking) {
            //     let bookingDate = new Date(booking.created_at);
            //     let dateNow = new Date();
            //     let seconds = (dateNow.getTime() - bookingDate.getTime()) / 1000;
            //     if(seconds >= 600){
            //         await BOOKING.delete({ id:booking.id }, false);
            //         booking = null;
            //     }
            // }
            let professionals;
            if(body.specialty){
                professionals = await PROFESSIONAL.all({profession_id: body.profession_id, specialty:body.specialty});
            }else{
                professionals = await PROFESSIONAL.all({profession_id: body.profession_id});
            }
            
            let message;
            
            const uuid = UUID_V4();
            body.uuid = uuid;

            let create_booking = await BOOKING.create({type:body.type,client_id:body.client_id,profession_id:body.profession_id,concern:body.concern,uuid:body.uuid});
            booking = await BOOKING.get({uuid:create_booking.uuid});
            if(req.files){
                
                let pictureDest = "./bookings/ " + booking.uuid + "/";
                if (!fs.existsSync(pictureDest)){
                    fs.mkdirSync(pictureDest, { recursive: true });
                }
                if(req.files['attachments']){
                    for(let i = 0; i < req.files['attachments'].length;i++){
                        let attachment = req.files['attachments'][i];
                        let supported = false;
                        fileExt = "";
                        for(let j = 0; j < supportedMimeTypes.length; j++){
                            let mimeType = supportedMimeTypes[j][0];
                            if(attachment.mimetype === mimeType){
                                supported = true;
                                fileExt = supportedMimeTypes[j][1];
                            }
                        }
                        if(supported){
                            let attachmentName = attachment.fieldname + i + "." + fileExt;
                            await fs.createWriteStream(pictureDest + attachmentName).write(attachment.buffer); 
                        }
                        
                    }
                }

            }
            professionals.forEach(function(professional,index){
                setTimeout(async function(){
                    let user_profile = await USER_PROFILE.get({user_id:professional.user_id});
                    let user = await USER.get({id:professional.user_id});
                    let client_user_profile = await USER_PROFILE.get({user_id:body.user_id});
                    const payload = {first_name:user_profile.first_name,uuid:booking.uuid, professional_uuid:user.uuid , client_first_name:client_user_profile.first_name,
                         client_last_name: client_user_profile.last_name, concern:body.concern};
                    await EMAIL_SERVICE.sendBookingProfessionalNotification(user.email,payload);
                    message = "Booking has been created";
                },1000 * index);
            });
            let timeNow = new Date();
            let timeCreated = new Date(booking.created_at);
            let remainingTime = 600 - ((timeNow - timeCreated) / 1000);
            booking.remainingTime = remainingTime > 0 ? (Math.floor(remainingTime/60) < 10 ? "0" + Math.floor(remainingTime/60) : Math.floor(remainingTime/60)) + ":" + (Math.floor(remainingTime%60) < 10 ? "0" + Math.floor(remainingTime%60) : Math.floor(remainingTime%60)) : "00:00";
            return { status: 200, booking:booking, message:message};

        } catch (err) {
            console.log(err);
            return { status: 500, message: toString(err) };
        }

    }
    async getBooking(params) {
        try {
            let user = await USER.get({ uuid:params.professional_uuid });
            if(!user){
                return { status: 404, message: "User does not exist"};
            }
            let booking = await BOOKING.get({ uuid:params.uuid });
            if(!booking){
                return { status: 404, message: "Booking does not exist"};
            }
            let professionals = await PROFESSIONAL.get({user_id: user.id});
            if(!professionals){
                return { status: 404, message: "User is not a professional"};
            }
            if(booking.profession_id != professionals.profession_id){
                return { status: 404, message: "Professional is not qualified"};
            }
            let client_profile = await USER_PROFILE.get( { user_id:booking.client_id } );
            booking.client_first_name = client_profile.first_name;
            booking.client_last_name = client_profile.last_name;    
            let timeNow = new Date();
            let timeCreated = new Date(booking.created_at);
            let remainingTime = 600 - ((timeNow - timeCreated) / 1000);
            booking.remainingTime = remainingTime > 0 ? (Math.floor(remainingTime/60) < 10 ? "0" + Math.floor(remainingTime/60) : Math.floor(remainingTime/60)) + ":" + (Math.floor(remainingTime%60) < 10 ? "0" + Math.floor(remainingTime%60) : Math.floor(remainingTime%60)) : "00:00";
                     
            return { status: 200, data: booking };

        } catch (err) {
            return { status: 500, message: err };
        }

    }
}

module.exports = BookingService;