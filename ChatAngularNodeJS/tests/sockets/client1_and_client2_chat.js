var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;


base.describe("send messages", function () {
    
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

                        client2.on("allUsers", function (users) {
                           
                            client2.emit("registerUser", "user 2");
                            client2.on("userRegistered", function (u) {
                                done();
                            });

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
    
    
    it("user 1 sends message to user 2", function (done) {
      
        client1.emit("chat", "user 1", "message from user 1");
        
        client2.on("chat", function (name, message) {
            if (name == "SYSTEM") return;//
            chai.expect(name).to.be.equal("user 1");
            chai.expect(message).to.be.equal("message from user 1");
            done();
        });//client 2
    });//it
    
    it("user 2 sends message to user 1", function (done) {
        client2.emit("chat", "user 2", "message from user 2");
        
        client1.on("chat", function (name, message) {
            if (name == "SYSTEM") return;//
            chai.expect(name).to.be.equal("user 2");
            chai.expect(message).to.be.equal("message from user 2");
            done();
        });
    });

});