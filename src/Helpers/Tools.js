"use strict"
const fs = require('fs');

module.exports = {

    mailOptions: async function (recipient, subject, body) {
        let mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: recipient,
            subject: subject,
            html: body
        };
        console.log("mail Options recipient " + mailOptions.to);

        return mailOptions;
    },

    getDiffInDays(date1, date2) {
        let MS_PER_DAY = 1000 * 60 * 60 * 24;
        let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.floor((utc1 - utc2) / MS_PER_DAY);
    },
    getImage(dir){
        return new Promise((resolve,reject)=>{
            fs.readFile(dir,function(err,content){
                if(err){
                    reject("Image does not exist");
                }
                    return resolve(content);
            });
        });
        
    }
}