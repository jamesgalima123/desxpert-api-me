"use strict"
const PROFESSIONAL_OFFICE = new (require('../Models/ProfessionalOffice'))();
class ProfessionalOfficeService  {

    async create(body) {

        try {
            let professionalOffice = await PROFESSIONAL_OFFICE.create(body, true);
            return { status: 200, message: 'Professional Office saved', data: professionalOffice };
        } catch (err) {
            return {status: 500 , message: err};
        }
    }
  
}

module.exports = ProfessionalOfficeService;
