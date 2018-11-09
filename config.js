module.exports = {	
	chatAccessToken:"18bc30c20f82483d82559bb1b7506d27",
	accessToken: "82717e62013740298f1660b33799f445",
    dialogflowAPI : "https://api.dialogflow.com/v1/query?v=20150910",
	responseObj:{
		"conversationToken": "",
		"expectUserResponse": true,
		"expectedInputs": [
			{
				"inputPrompt": {
					"richInitialPrompt": {
						"items": [],
						"suggestions": []								
					}
				},
				"possibleIntents": [
					{
						"intent": "actions.intent.TEXT"
					}
				]
			}
		]
	},
	"flemming":"BH@hexaware.com",
	"Jhon":"bhariprasad.msc@gmail.com",
	 calendarEvent : {
		'summary': 'Appointment scheduled between Hannah - Friedrich',
		'location': 'via phone',
		'description': 'Hannah Wagner needs help regarding insurance coverage for Candy Manufacturing Assets.',
		'organizer': {
			'email': 'hex.digitalinsurer@gmail.com',
			'self': true
		},
		'start': {
			'dateTime': '2018-11-15T14:00:00-9:00',
			'timeZone': 'Asia/Kolkata',
		},
		'end': {
			'dateTime': '2018-11-15T15:00:00-07:00',
			'timeZone': 'Asia/Kolkata',
		},
		'recurrence': [
			'RRULE:FREQ=DAILY;COUNT=2'
		],
		'attendees': [
			{'email': 'friedrich.Ragent@gmail.com'},
			{'email': 'hannahw.w01@gmail.com'}			
		],
		'reminders': {
			'useDefault': false,
			'overrides': [
				{'method': 'email', 'minutes': 24 * 60},
				{'method': 'popup', 'minutes': 10},
			],
		},
	},
	IAQuestions:["Hi, How can I help you?","Sure. Wait for a second","I have another meeting at 3 pm which will get over only by 4 pm","The earliest I can call Hannah is around 4.15 pm","Sure. I can call Hannah at 2.30 pm tomorrow","Can you provide the contact details of Hannah Wagner","Thanks. I have made a note of it and I will call Hannah Wagner at 2.30 pm tomorrow","Meanwhile, can you request Hannah Wagner to send me a property inspection report for her Candy business","Great. Have a good day. Bye"],
	botResponses:["Hi. I am calling to book an appointment for a client, Hannah Wagner who wants to insure the assets of her candy manufacturing business. I am looking for your time , sometime tomorrow at 3 pm","Okay","Oh","Do you have any availability between 2 to 4 pm tomorrow?","2:30 pm is fine","Her mobile number is 1 5 2 3 3 9 1 8 8 8 8 and her email id is h a n n a h w.w 0 1@gmail.com","Great","Sure. I will do that. Thanks"],
	waitResponses:{
		"idle":"No Mr. John, for what, what is an issue, can you explain",
		"dialing":"Sorry for the wait Mr. John, dialing going please will hold few minutes",
		"inCall":"Sorry for the wait Mr. John, I am talking with IA please wait one minute I will update appointment confirmation",
		"callNotConnected":"Sorry for the wait Mr. John, Right now I am unable to find IA, I will update appointment confirmation later"
	},
	accountSid:'ACe788af00045986dd0da11967b42ace22',
	authToken:'b41ba3c834058e5dfa82b561ca8842dc'
}

