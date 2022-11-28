"use strict"
const request = require ("request");
const e = require("express");
const CONTRACT = new (require('../Models/Contract'))();
const PROPOSAL = new (require('../Models/Proposal'))();
const USER = new (require('../Models/User'))();
const USER_PROFILE = new (require('../Models/UserProfile'))();

class PaymentService {

    async paymentHook(req) {
        let body = req.body;
        console.log(JSON.stringify(body));
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
                let response = await new Promise((resolve,reject)=>{
                    request.post({
                        headers: headers,
                        url:     'https://api.paymongo.com/v1/payments',
                        body: JSON.stringify(fields)
                      }, function(error, response, body){
                        if(error){
                            return reject(error);
                        }
                        if(body){
                            return resolve(body);
                        }
                      });
                });
                return {status:200,message:response};

          
            }else if(type === 'payment.paid'){
                let amount = body.data.attributes.data.attributes.amount;
                let id = body.data.attributes.data.id;
                let description = "gcash payment description";
                let fields = {data:{attributes:{amount:amount,source:{id:id,type:'source'},currency:'PHP',description:description}}};
                const headers = {
                    "Accept":"application/json",
                    "Authorization":"Basic c2tfdGVzdF9TbzR2OFpkbmNEV2YxRmRyQjJqbms4eHA6",
                    "Content-Type":"application/json"
                };
                let response = await new Promise((resolve,reject)=>{
                    request.post({
                        headers: headers,
                        url:     'https://api.paymongo.com/v1/payments',
                        body: JSON.stringify(fields)
                      }, function(error, response, body){
                        if(error){
                            return reject(error);
                        }
                        if(body){

                            return resolve(body);
                        }
                      });
                });
                response = JSON.parse(response);
                return {status:200,message:response};

          
            }
            return {status:404,message:'Event type does not exist'};
        }catch(err){
            return {status:500,message:toString(err)};
        }
        
    }
    async getEwalletPayment(req) {
        let body = req.body;
        let params = req.params;
        try {

            let contract_uuid = params.contract_uuid;
            let type = params.type;
            let contract = await CONTRACT.get( {uuid:contract_uuid,status:'inprogress'} );
            console.log(contract_uuid);
            if(!contract){
                return {status:404,message:'Contract does not exist'};
            }
            let user = await USER.get( {id:contract.client_id} );
            let user_profile = await USER_PROFILE.get( {user_id:contract.client_id} );
            console.log('falala');

            
            let proposal = await PROPOSAL.get( {uuid:contract.proposal_uuid} );

            if(type === 'gcash' || type === 'grab_pay'){
                let fields = {data:{attributes:{amount:parseInt(proposal.fee + "00"),billing:{email:user.email,name: user_profile.first_name + " " + user_profile.last_name},redirect:{success:"https://developers.paymongo.com/docs/accepting-gcash-payments",failed:"https://www.facebook.com/watch/?v=515061943985743"},type:type,currency:"PHP"}}};
                const headers = {
                    "Accept":"application/json",
                    "Authorization":"Basic c2tfdGVzdF9TbzR2OFpkbmNEV2YxRmRyQjJqbms4eHA6",
                    "Content-Type":"application/json"
                };
                let response = await new Promise((resolve,reject)=>{
                    request.post({
                        headers: headers,
                        url:     'https://api.paymongo.com/v1/sources',
                        body: JSON.stringify(fields)
                      }, function(error, response, body){
                        if(error){
                            return reject(error);
                        }
                        if(body){
                            return resolve(body);
                        }
                      });
                });

                response = JSON.parse(response);
                if(!response.data){
                    return {status:500,message:response};  
                }
                let checkout_url = response.data.attributes.redirect.checkout_url;
                return {status:200,message:'success',data:checkout_url};
            }
            return {status:404,message:'E wallet does not exist'};
        }catch(err){
            return {status:500,message:toString(err)};
        }
        
    }
}

module.exports = PaymentService;