"use strict";

var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;

base.describe("Logging out", function () {
    //this.timeout(150000);
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
    
    
    describe("user 1 logs out", function () {
        
        beforeEach(function () {
            
            client2.removeAllListeners("allUsers");
            client1.removeAllListeners("allUsers");

            client1.emit("logOut", "user 1");
           
        });
        
        it("sends the allUser message to user 1", function (done){
            client1.on("allUsers", function (users) {
                
                chai.expect(users.length).to.be.equal(1);
                chai.expect(users[0].name).to.be.equal("user 2");
                done();
            });
        })
        
        it("sends the allUser message to user 2", function (done) {
            client2.on("allUsers", function (users) {
               
                chai.expect(users.length).to.be.equal(1);
                chai.expect(users[0].name).to.be.equal("user 2");
                done();
            });
        });
        
        it("send log message to user 1 - user 1 has been logged out", function (done) {
            
            client1.on("log", function (msg) {
                chai.expect(msg).to.be.equal("User 'user 1' has been logged out");
                done();
            });
        });

        it("send chat message to user 2 - user 1 has left", function (done) {
         
            client2.on("chat", function (name, text) {
                if (name == "SYSTEM" && text == "User 'user 1' has left") {
                    done();
                }
            });
        });
    });


});//describe