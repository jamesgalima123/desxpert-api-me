"use strict"
const { v4: UUID_V4 } = require('uuid')
const USER = new (require('../Models/User'))();
const CONTRACT = new (require('../Models/Contract'))();
const BOOKING = new (require('../Models/Booking'))();
const PROPOSAL = new (require('../Models/Proposal'))();

class ContractService {

    async createContract(body) {
        try {
            let proposal = await PROPOSAL.get({ uuid:body.proposal_uuid});
            console.log("res " + body.prpodwdsal_uuid);
            if(!proposal){
                return { status: 404, message:"Proposal does not exist" };
            }
            let booking = await BOOKING.get({ uuid:proposal.booking_uuid });
            if(!booking){
                return { status: 404, message:"Booking does not exist" };
            }
            if(booking.status === "accepted"){
                return { status: 404, message:"Contract has already been made" };
            }
            let user = await USER.get( { uuid:body.client_uuid } );
            if(!user){
                return { status: 404, message:"User does not exist" };
            }
            body.client_id = user.id;
            if(booking.client_id != body.client_id){
                return { status: 300, message:"Client ID does not match" };
            }
            const uuid = UUID_V4();
            body.uuid = uuid;
            let contract = await CONTRACT.create({ client_id:body.client_id, professional_id:proposal.professional_id, uuid:body.uuid, proposal_id:proposal.id, booking_id:booking.id });
            BOOKING.update({ status:"accepted" },{ uuid:proposal.booking_uuid });
            return { status: 200, message:"Contract has been created",data:contract };

        } catch (err) {
            return { status: 500, message: toString(err) };
        }

    }
    async getContract(req) {
        let params = req.params;
        try {
            let user = await USER.get( {uuid:params.uuid} );
            let contract = await CONTRACT.get( {client_id:user.id} );
            if(!contract){
                return { status: 404,message:'Contract does not exist' };
            }
            return { status: 200,contract:contract };

        } catch (err) {
            return { status: 500, message: toString(err) };
        }

    }
    
}

module.exports = ContractService;