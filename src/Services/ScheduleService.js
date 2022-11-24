"use strict"

const SCHEDULE = new (require('../Models/Schedule'))();
class ScheduleService {

    async create(body) {

        try {
            let schedules = body.schedules;
            let duplicates = 0;
            for (let i = 0; i < schedules.length; i++) {
                let schedule = schedules[i];
                let isExist = await SCHEDULE.get({ 'user_id': schedule.user_id, 'day_of_week': schedule.day_of_week, 'time_from': schedule.time_from, 'time_to': schedule.time_to,'professional_fee':schedule.professional_fee });
                if (isExist) {
                    duplicates += 1;
                }
            }
            if (duplicates == 0) {
                for (let i = 0; i < schedules.length; i++) {
                    let schedule = schedules[i];
                    await SCHEDULE.create({ 'user_id': schedule.user_id, 'day_of_week': schedule.day_of_week, 'time_from': schedule.time_from, 'time_to': schedule.time_to,'professional_fee':schedule.professional_fee }, true);
                }
                return { status: 200, message: "Schedules have been created" };
            } else {
                return { status: 500, message: "There are " + duplicates + " duplicate schedules" };
            }

        } catch (err) {
            console.log("error " + err);
            return { status: 500, message: err };
        }

    }
   
}

module.exports = ScheduleService;
