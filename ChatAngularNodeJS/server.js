var http = require("http");
var express = require("express");
var controllers = require("./Controllers");
var socket = require("./Socket/socket.js");
var port = process.env.port || 3000;

var app = express(); //represents our singleton app object

//setup view engine
app.set("view engine", "vash");

//set the public static resource folder
app.use(express.static(__dirname + '/public'));


//inits
controllers.init(app);


//server
var server = http.createServer(app);


socket.init(server);

server.listen(port);

