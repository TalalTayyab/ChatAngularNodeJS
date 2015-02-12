var rewire = require("rewire");
var io = require("socket.io-client");
var http = require("http");
var _ = require("underscore");
var socket = rewire("../../socket/socket.js");
var Users = require("../../socket/users.js");


var socketURL = 'http://localhost:3000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

module.exports.Users = Users;

module.exports.connect = function () {
    return io.connect(socketURL, options);
}

module.exports.describe = function (text, func) {
    
    describe("When server is listening", function () {
        
         var server;
        
        before(function () {
            
            server = http.createServer(function (req, res) { 
            });
            socket.init(server);
            server.listen(3000);

        });
        
        after(function () {
            server.close();
        });
        
        describe(text, func);


    });
};




