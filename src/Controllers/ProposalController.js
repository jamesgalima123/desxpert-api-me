"use strict"
const PROPOSAL_SERVICE = new (require('../Services/ProposalService'))();


module.exports = {

    createProposal: async (req,res) => {

        try {
            let response = await PROPOSAL_SERVICE.createProposal(req.body);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    },
    getProposalsByBookingUUID: async (body) => {

        try {
            let response = await PROPOSAL_SERVICE.getProposalsByBookingUUID(body);
            return response;
        } catch (err) {
            console.log("the error " + err);
            return { status: 5001, message: toString(err) };
        }
    }
}
