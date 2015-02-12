var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;


base.describe("client 2 registers", function () {
    
    var client1, client2;
    
    beforeEach(function (done) {
        
        //remove all the users
        Users.removeAll();
        
        client1 = base.connect();
        
        client1.on('connect', function (data) {
            client1.emit("newClient");
            
            client1.on("allUsers", function (users) {
                
                client1.emit("registerUser", "user 1");
                
                client1.on("userRegistered", function (u) {
                    client2 = base.connect();
                    
                    client2.on('connect', function () {
                        client2.emit("newClient");
                        client2.on("allUsers", function () {

                            client2.emit("registerUser", "user 2");
                            done();
                        });
                       
                    });//client1
                });

              

     
            });
               
        });//client1

            
    });//beforeEach
    
    afterEach(function () {
        client1.disconnect();
        client2.disconnect();
    });

   
    
    it("sends the user 2 userRegistered message to user 2", function (done) {
        
        //client1.on("allUsers", allUsers);
        client2.on("userRegistered", function (user) {
            chai.expect(user.name).to.equal("user 2");
            done();
        });
        
        
    });//it
    
   
    it("sends the user 2 newUser message to user 1", function (done) {
        client1.on("newUser", function (user) {
            chai.expect(user.name).to.equal("user 2");
            done();
        });
    });
    
    
    it("sends the user 2 joined chat message to user 1", function (done) {
        var count = 0;
        client1.on("chat", function (name, text) {
            chai.expect(name).to.equal("SYSTEM");
            chai.expect(text).to.equal("User 'user 2' has joined the chat");
            done();
        });
    });
    
    it("sends the user 2 joined chat message to user 2", function (done) {
        var count = 0;
        client2.on("chat", function (name, text) {
            chai.expect(name).to.equal("SYSTEM");
            chai.expect(text).to.equal("User 'user 2' has joined the chat");
            done();
        });
    });
  
    it("sends the user 2 added log message to user 2", function (done) {
        client2.on("log", function (msg) {
            chai.expect(msg).to.equal("User 'user 2' added");
            done();
        });
    });

});