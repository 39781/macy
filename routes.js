var express 		= require('express');
var router			= express.Router();	 
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var url				= require('url')
var path			= require("path");	
var config			= require('./config');	
const uuidv1 		= require('uuid/v1');
var mail			= require('./utilities/mail');
var calendar		= require('./utilities/calender.js');	
const accountSid = config.accountSid;
const authToken = config.authToken;
const client = require('twilio')(accountSid, authToken);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var k = 0;
//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.send("welcome to macy");
});

router.get('/reply',function(req, res){
	const response = new VoiceResponse();
	//var txt = q.SpeechResult.replace(/[+]/,' ');
	//console.log('text',txt);
	//req.query.SpeechResult
	dialogflowAPI(req.query.SpeechResult, req.query.cid)
	.then(function(resp){
		for(l=0;l<resp.result.fulfillment.messages.length;l++){
			message = resp.result.fulfillment.messages[l];
		//resp.result.fulfillment.messages.forEach(function(message){
			console.log(resp.result.metadata.intentName);
			if(resp.result.metadata.intentName == 'IAConversation7'){
				calendar.createEvent();		
			}
			if(message.platform=='google'&&message.type=="simple_response"){						
				if(/bye/ig.test(message.textToSpeech)){
					callHistory[resp.sessionId] = 'end';
					response.hangup();					
				}else{									
					/*if(resp.result.metadata.intentName == 'Default Fallback Intent'&&req.query.repl<7){
						console.log('k value',k);										
						message.textToSpeech = config.botResponses[req.query.repl];						
					}*/									
					response.redirect({method:'GET'},'https://fast-reef-26757.herokuapp.com/answer?SpeechResult='+encodeURIComponent(message.textToSpeech)+'&cid='+resp.sessionId);
				}
				res.writeHead(200, { 'Content-Type': 'text/xml' });
				res.end(response.toString());
				break;
			}													
		}		
	})
	.catch((err)=>{
		console.log(err);
	})		
});


router.get('/answer',function(req, res){	
	const response = new VoiceResponse();	
	/*twimlResponse.say('Thanks for contacting our sales department. Our ' +
	  'next available representative will take your call. ',
	  { voice: 'alice' });

	twimlResponse.dial(salesNumber);
	
        res.send(twimlResponse.toString());*/    
		callHistory[req.query.cid] = 'inCall';	
	const gather = response.gather({
	  input: 'speech dtmf',	  
	  numDigits: 1,	  
	  hints:"word, a phrase, another longer phrase, term, thing, proper product name",
	  speechTimeout:'auto',
	  language:"en-US",
	  action:'/reply?cid='+req.query.cid,
	  method:'GET'
	});
	console.log(req.query.SpeechResult);
	
	gather.say(req.query.SpeechResult,{voice: 'woman'});	
	response.redirect({method:'GET'},'https://fast-reef-26757.herokuapp.com/answer?SpeechResult='+encodeURIComponent("are you there?")+'&cid='+req.query.cid);
	//gather.say(botRep[req.query.textResult],{ voice: 'alice' });	
	res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(response.toString());
});



router.get('/call',function(req, res){	
		
	client.calls
	  .create({
		url: 'https://fast-reef-26757.herokuapp.com/answer?SpeechResult=Hello&cid='+req.query.cid,
		//to: '+919597439539',
		to: '+918500050085',
		from: '+18507417927',
		method:"GET"	
	  })
	  .then(call => {			
			callHistory[req.query.cid] = 'dialing';		  
		  	res.status(200).send("started");
	  })
	  .catch(err =>	{		
			res.status(500).send(err);
			callHistory[req.query.cid] = 'callNotConnected';		  
	  });	
});



router.get('/event',function(req, res){
	console.log(req.params, req.query);
	console.log('event');
	res.end();
});

router.post('/chatDialogflowAPI', function (req, res) {
	var options = {
		method: 'POST',
		url: config.dialogflowAPI,
		headers: {
			"Authorization": "Bearer " + config.chatAccessToken
		},
		body: req.body,
		json: true
	};
	request(options, function (error, response, body) {
		if (error) {
			console.log(config.chatAccessToken, config.dialogflowAPI, error);
			res.json({ error: "error in chat server api call" }).end();
		} else {
			
			if(body.result && body.result.action && body.result.action=='discount'){

				body.result.fulfillment.messages[2].speech = '<a class="pdfClass" data-toggle="modal" data-target="#fundModal">Click here</a> to refer the discount chart for more details'
				res.json(body).end();
			} else if(body.result && body.result.action && body.result.action =="riskClass"){
				
				let riskClass = body.result.parameters && body.result.parameters.RiskClass ? body.result.parameters.RiskClass : null;
				console.log('YEAH', riskClass, body.result.parameters);
				if(riskClass){

					var options = {
						method: 'POST',
						url: "http://10.76.1.53:7999/aa/industry",
						headers: {},
						body: {"code": riskClass},
						json: true
					};
					request(options, function (error, response, responseBody) {
						if (error) {
							console.log('ERROR IN GUIDEWIRE API CALL');
							res.json(body).end();
						} else {
							console.log('SUCCESS IN GUIDEWIRE API CALL', response, responseBody);
							if(responseBody && responseBody.description){
								body.result.fulfillment.messages[0].speech = body.result.fulfillment.messages[0].speech.replace('Candy & Confectionery Products Manufacturing', responseBody.description);
							}
							res.json(body).end();
						}
					});					
				} else {
					res.json(body).end();
				}
			} 
			else{
				res.json(body).end();
			}
		}
	});
});

router.post('/',function(req, res){				
	if(typeof(callHistory[req.body.conversation.conversationId])=='undefined'){
		callHistory[req.body.conversation.conversationId] = 'idle';
	}
	var len = req.body.inputs.length;
	var response = JSON.parse(JSON.stringify(config.responseObj));					
	for(i=0; i<len; i++){				
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query, req.body.conversation.conversationId)
			.then(function(resp){
				for(l=0;l<resp.result.fulfillment.messages.length;l++){
					message = resp.result.fulfillment.messages[l];
					//resp.result.fulfillment.messages.forEach(function(message){		
					if(resp.result.metadata.intentName == 'customerFindReq'&&callHistory[resp.sessionId] != 'end'){						
						message.textToSpeech = config.waitResponses[callHistory[resp.sessionId]];
					}else{
						delete callHistory[resp.sessionId];
					}						
					if(message.platform=='google'&&message.type=="simple_response"){						
						simpleResponse(response, message.textToSpeech);
					}	
					if(message.platform=='google'&&message.type=="suggestion_chips"){
						sugesstionChips(response, message.suggestions);
					}					
				};				
				if(resp.result.metadata.intentName == 'finalIntent'){
					request({url:'https://fast-reef-26757.herokuapp.com/call?cid='+resp.sessionId,strictSSL: false,rejectUnauthorized: false,requestCert: true, agent: false}, function (error, response, body) {
						  console.log('error:', error); // Print the error if one occurred
						  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
						  console.log('body:', body); // Print the HTML for the Google homepage.
					});												
					res.json(response).end();
				}else{
					res.json(response).end();
				}					
				//);						
			})
			.catch((err)=>{
				console.log(err);
			})	
			break;
		}else if(req.body.inputs[i].intent == 'actions.intent.MAIN'){			
			simpleResponse(response, "Hi Anna, I'm Macy. Your friendly Personal Assistant. How can I help you today?");
			res.json(response).end();
			break;
		}
	}	
});



var dialogflowAPI = function(input, sessId){	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogflowAPI,
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{
				sessionId: sessId,
				lang: "en",
				query:input
			},			
			json: true 
		}; 					
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{						
				resolve(body);
			}		
		});			
	});
}


var simpleResponse = function(response, responseText){
	response.expectedInputs[0].inputPrompt.richInitialPrompt.items.push({
		"simpleResponse": {
			"textToSpeech": responseText,
			"displayText": responseText
		}
	});	
	return response;
}



var sugesstionChips = function(response, suggestions){
	console.log(suggestions);
	response.expectedInputs[0].inputPrompt.richInitialPrompt.suggestions = suggestions;	
}



module.exports = router;



			