"use strict"
const request = require ("request");
const { promises } = require("nodemailer/lib/xoauth2");
class PaymentService {

    async gcash(req) {
        let body = req.body;
        try {
            
            let type = body.data.attributes.type;
            if(type === 'source.chargeable'){
                let amount = body.data.attributes.data.attributes.amount;
                let id = body.data.attributes.data.id;
                let description = "gcash payment description";
                let fields = {data:{attributes:{amount:amount,source:{id:id,type:'source'},currency:'PHP',description:description}}};
                const headers = {
                    "Accept":"application/json",
                    "Authorization":"Basic c2tfdGVzdF9TbzR2OFpkbmNEV2YxRmRyQjJqbms4eHA6",
                    "Content-Type":"application/json"
                };
                request.post({
                    headers: headers,
                    url:     'https://api.paymongo.com/v1/payments',
                    body: JSON.stringify(fields)
                  }, function(error, response, body){
                    console.log(body);
                  });
                
            
          
            }
            return {status:200,message:'success'};
        }catch(err){
            return {status:500,message:toString(err)};
        }
        
    }
}

module.exports = PaymentService;