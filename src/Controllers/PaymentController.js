"use strict"
const PAYMENT_SERVICE = new (require('../Services/PaymentService'))();


module.exports = {

    gcash: async (req,res) => {

        try {
            let response = await PAYMENT_SERVICE.gcash(req);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    }
}
