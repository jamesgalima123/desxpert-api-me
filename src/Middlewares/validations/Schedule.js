const validator = require('validatorjs');

module.exports = {

    /**
     * Create data validation middleware
     * 
     * @param Request req 
     * @param Response res 
     * @param Next next 
     */
    create: async (req, res, next) => {
        let body = req.body;
        if (body.schedules) {
            let schedules = body.schedules;
            for (let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i];
                let rules = {
                    user_id: "required|numeric",
                    time_from: "required|string",
                    time_to:"required|string",
                    day_of_week: "required|string",
                    professional_fee: "required|numeric"
                }

                let validation = new validator(schedule, rules);

                if (validation.fails()) {
                    return res.json({ status: 422, message: validation.errors.all(), ...validation.errors });
                }
            }
        } else {
            return res.json({ status: 422, message: "Schedules missing"});
        }

        next();
    }
};
