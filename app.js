require('dotenv').config();

const EXPRESS = require('express');
const APP = EXPRESS();
const PORT = process.env.APP_PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;
const WebSocket = require('ws').Server;
const CORS = require('cors');

const AUTH = require('./src/Handlers/Auth.js');
const ROLE = require('./src/Handlers/Role.js');
const PERMISSION = require('./src/Handlers/Permission.js');
const BOOKING = require('./src/Handlers/Booking.js');
const PROPOSAL = require('./src/Handlers/Proposal.js');
const CONTRACT = require('./src/Handlers/Contract.js');
const PROFESSION = require('./src/Handlers/Profession.js');
const PROFESSIONAL = require('./src/Handlers/Professional.js');
const CLIENT = require('./src/Handlers/Client.js');
const USER = require('./src/Handlers/User.js');
const USER_PICTURES = require('./src/Handlers/UserPictures.js');
const VERIFICATION = require('./src/Handlers/Verification.js');
const REQUEST_LINK = require('./src/Handlers/RequestLink.js');
const TAGLINE = require('./src/Handlers/Tagline.js');
const SCHEDULE = require('./src/Handlers/Schedule.js');
const ImageDataURI = require('image-data-uri');
const clients = new Map();
const Profession = require('./src/Models/Professional.js');
APP.options('*', CORS());

APP.all('/', (req, res) => {
	return res.json(process.env.APP_VERSION)
});

APP.all('/auth/*', AUTH);
APP.all('/auth', AUTH);

APP.all('/roles/*', ROLE);
APP.all('/roles', ROLE);

APP.all('/permissions/*', PERMISSION);
APP.all('/permissions', PERMISSION);

APP.all('/bookings/*', BOOKING);
APP.all('/bookings', BOOKING);

APP.all('/proposals/*', PROPOSAL);
APP.all('/proposals', PROPOSAL);

APP.all('/contracts/*', CONTRACT);
APP.all('/contracts', CONTRACT);

APP.all('/schedules/*', SCHEDULE);


APP.all('/professions/*', PROFESSION);
APP.all('/professions', PROFESSION);

APP.all('/clients/*', CLIENT);
APP.all('/clients', CLIENT);

APP.all('/professionals/*', PROFESSIONAL);
APP.all('/professionals', PROFESSIONAL);

APP.all('/taglines/*', TAGLINE);
APP.all('/taglines', TAGLINE);

APP.all('/user-pictures/*', USER_PICTURES);
APP.all('/user-pictures/', USER_PICTURES);

APP.all('/users/verification/*', VERIFICATION);
APP.all('/users/verification/', VERIFICATION);

APP.all('/users/request-link/*', REQUEST_LINK);
APP.all('/users/request-link/', REQUEST_LINK);
APP.all('/users/*', USER);
APP.all('/users', USER);

APP.use(EXPRESS.static(__dirname, { dotfiles: 'allow' } ));

if (process.env.APP_CONN == "https") {
	
	const https = require('https');
	const fs = require('fs');

	const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
	const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8');
	const ca = fs.readFileSync(process.env.FULL_CHAIN, 'utf8');

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};
	
	var server = https.createServer(credentials, APP);
	const port = process.env.PORT || 3000;
	server.listen(port, () => {
	  console.log("https server starting on port : " + port)
	});

	if (process.env.ENABLE_WEBSOCKET) {
        let wss = new WebSocket({ server: server});
			wss.on('connection', (ws) => {
				let metaData = null;
				let ret = {status:200,message:"connected"};
				ws.send(JSON.stringify(ret));
				ws.on('message', async (messageAsString) => {
					const body = JSON.parse(messageAsString);
		
					if(!metaData && body.type === 'client'){
						metaData = { booking_uuid:body.booking_uuid, proposals:[],type:"client" };
						clients.set(ws,metaData);
						sendMessage(ws,metaData);
					}else if(body.type === 'client'){
						sendMessage(ws,metaData);
					}else if(!metaData && body.type === 'professional'){
						metaData = { booking_uuid:body.booking_uuid, proposals:[],type:"client" };
						clients.forEach((client,key)=>{
							let isEmpty = true;
							if(client.booking_uuid === body.booking_uuid){
								isEmpty = false;
								let insert = true;
								client.proposals.forEach((proposal,proposal_key)=>{
									if(proposal.proposal_uuid === body.proposal.proposal_uuid){
										insert = false;
									}
								});
								let message = "";
								if(insert){
									client.proposals[client.proposals.length] = body.proposal;
									message = {status:200,message:"You have sent your proposal"};
								}else{
									message = {status:200,message:"You have an existing proposal"};
								}
								
								ws.send(JSON.stringify(message));
							}else if(isEmpty){
								message = {status:4043,message:"Booking does not exist"};
								ws.send(JSON.stringify(message));			
							}
						});
		
						if(clients.size == 0){
							message = {status:4044,message:"Booking does not exist"};
							ws.send(JSON.stringify(message));	
						}
					}
					
				});
				ws.on('close', async (messageAsString) => {
					console.log("disconnected ");
					
				});
			});
			const sendMessage = async(ws,metaData)=>{
				if(metaData){
					ws.send(JSON.stringify(metaData));
				}
			};
	}
} else {
	APP.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
}

