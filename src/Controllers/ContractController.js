"use strict"
const CONTRACT_SERVICE = new (require('../Services/ContractService'))();


module.exports = {

    createContract: async (req,res) => {

        try {
            let response = await CONTRACT_SERVICE.createContract(req.body);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    },
    getContract: async (req,res) => {

        try {
            let response = await CONTRACT_SERVICE.getContract(req);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    }
}
