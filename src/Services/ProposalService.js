"use strict"
const { v4: UUID_V4 } = require('uuid')
const PROFESSIONAL = new (require('../Models/Professional'))();
const PROFESSION = new (require('../Models/Profession'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();
const USER = new (require('../Models/User'))();
const BOOKING = new (require('../Models/Booking'))();
const PROPOSAL = new (require('../Models/Proposal'))();

class ProposalService {

    async createProposal(body) {
        try {
            let user = await USER.get( {uuid:body.professional_uuid} );
            if(!user){
                return { status: 404, message: "User does not exist" };
            }
            let user_profile = await USER_PROFILE.get( {user_id:user.id} );
            let professional = await PROFESSIONAL.get({ user_id:user.id });
            if(!professional){
                return { status: 404, message: "Professional does not exist" };
            }
            let booking = await BOOKING.get({ uuid:body.booking_uuid });
            if(!booking){
                return { status: 404, message: "Booking does not exist"};
            }
            if(booking.profession_id != professional.profession_id){
                return { status: 404, message: "Professional is not qualified"};
            }
            let proposal_is_exist = await PROPOSAL.get({ booking_uuid:body.booking_uuid, professional_id:professional.id });
            if(proposal_is_exist){
                return { status: 300, message: "You have already sent a proposal"};
            }
            const uuid = UUID_V4();
            body.uuid = uuid;
            let profession = await PROFESSION.get( { id:professional.profession_id } );
            let proposal = await PROPOSAL.create({ uuid:body.uuid,professional_id:professional.id, booking_uuid:body.booking_uuid, fee:body.fee });
            let professional_json = {
                proposal_uuid: proposal.uuid,
                fee:proposal.fee,
                booking_uuid:proposal.booking_uuid,
                created_at:proposal.created_at,
                first_name: user_profile.first_name,
                last_name: user_profile.last_name,
                profession: profession.name,
                profession_hex: profession.color_hex,
                clinic: professional.clinic,
                clinic_street_name: professional.clinic_street_name,
                clinic_country: professional.clinic_country,
                clinic_state: professional.clinic_state,
                clinic_city: professional.clinic_city,
                clinic_zipcode: professional.clinic_zipcode,

            };
            return { status: 200, message:"Proposal has been created", proposal:professional_json };

        } catch (err) {
            return { status: 500, message: toString(err) };
        }

    }
    async getProposalsByBookingUUID(body) {
        try {
            let proposals = await PROPOSAL.all({ booking_uuid:body.booking_uuid });
            for(let i = 0; i < proposals.length; i++){
                let proposal = proposals[i];
                let professional = await PROFESSIONAL.get( { id:proposal.professional_id } );
                let user_profile = await USER_PROFILE.get( { user_id:professional.user_id } );
                let profession = await PROFESSION.get( { id:professional.profession_id } );
                let professional_json = {
                    first_name: user_profile.first_name,
                    last_name: user_profile.last_name,
                    profession: profession.name,
                    profession_hex: profession.color_hex,
                    clinic: professional.clinic,
                    clinic_street_name: professional.clinic_street_name,
                    clinic_country: professional.clinic_country,
                    clinic_state: professional.clinic_state,
                    clinic_city: professional.clinic_city,
                    clinic_zipcode: professional.clinic_zipcode
                };
                if(professional.specialty){
                    let specialty = await PROFESSION.get( { id:professional.specialty } );
                    professional_json.specialty = specialty.name;
                }
                proposals[i].professional = professional_json;
                proposals[i].user_profile = user_profile;
            }
            if(!proposals){
                return { status: 404, message: "Professional does not exist" };
            }
            return { status: 200, proposals:proposals };

        } catch (err) {
            console.log(err);
            return { status: 5000, message: toString(err) };
        }

    }
    
}

module.exports = ProposalService;