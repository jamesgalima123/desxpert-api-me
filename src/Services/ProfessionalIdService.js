"use strict"
const PROFESSIONAL_ID = new (require('../Models/ProfessionalId'))();
class ProfessionalIdService  {

    async create(professional_id_req) {

        try {
            let professional_id = await PROFESSIONAL_ID.create({
                professional_id: professional_id_req.professional_id, type: professional_id_req.type,
                link: professional_id_req.link, value: professional_id_req.value
            }, true);
            return { status: 200, message: 'Professional ID saved', data: professional_id };
        } catch (err) {
            return {status: 500 , message: err};
        }
        
        
    }
  
}

module.exports = ProfessionalIdService;
