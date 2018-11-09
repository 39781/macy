var express = require('express');
var https 	= require('https');
var http 	= require('http');
var app 	= express();
var fs 		= require('fs');

var options = {
	key : fs.readFileSync('abels-key.pem'),
	cert : fs.readFileSync('abels-cert.pem')
};

app.get('/', function(req, res){
	res.send('Hello World!');
});

http.createServer(app).listen(8099, function(){
	console.log('Http listening on 8080');
});

https.createServer(options, app).listen(443, function(){
	console.log('https listening on 443');
})