var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;



base.describe("client 1 registers as User 1", function () {
    
    var client1;
    
    beforeEach(function (done) {
        
        //remove all the users
        Users.removeAll();
        
        client1 = base.connect();
        
        client1.on('connect', function (data) {
            client1.emit("newClient");
            
            client1.on("allUsers", function () {
                client1.emit("registerUser", "user 1");
                done();
            });
               
        });//client1

            
    });
    
    afterEach(function (){
        client1.disconnect();
    });
    
    it("user 1 gets the userRegistered message with param user 1", function (done) {
        
        //client1.on("allUsers", allUsers);
        client1.on("userRegistered", function (user) {
            chai.expect(user.name).to.equal("user 1");
            done();
        });
     
    });//it
    
    it("user 1 gets the user 1 joined chat message", function (done) {
        
        client1.on("chat", function (name, text) {
            chai.expect(name).to.equal("SYSTEM");
            chai.expect(text).to.equal("User 'user 1' has joined the chat");
            done();
        });
    });//it
    
    it("user 1 gets user 1 added log message", function (done) {
        client1.on("log", function (msg) {
            chai.expect(msg).to.equal("User 'user 1' added");
            done();
        });
    });
        
       
});//describe user 1 register