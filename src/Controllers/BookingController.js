"use strict"
const BOOKING_SERVICE = new (require('../Services/BookingService'))();


module.exports = {

    sendBooking: async (req,res) => {

        try {
            let response = await BOOKING_SERVICE.sendBooking(req);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    },
    getBooking: async (req,res) => {

        try {
            let response = await BOOKING_SERVICE.getBooking(req.params);
            return res.json(response);
        } catch (err) {
            return { status: 500, message: err };
        }
    }
}
