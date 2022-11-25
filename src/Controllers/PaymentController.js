"use strict"
const PAYMENT_SERVICE = new (require('../Services/PaymentService'))();


module.exports = {

    paymentHook: async (req,res) => {

        try {
            let response = await PAYMENT_SERVICE.paymentHook(req);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    }
}
