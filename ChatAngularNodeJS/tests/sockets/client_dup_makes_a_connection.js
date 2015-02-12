var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;


base.describe("client dup makes a connection", function () {
    
    var client1, client3;
    
    beforeEach(function (done) {
        
        //remove all the users
        Users.removeAll();
        
        client1 = base.connect();
       

        client1.on('connect', function (data) {
            client1.emit("newClient");
            
            client1.on("allUsers", function () {
                client1.emit("registerUser", "user 1");
            });
            
            client1.on("userRegistered", function () {
                
                client3 = base.connect();
                client3.on('connect', function () {
                    client3.emit("newClient");
                    done();
                });
            });
   
        });//client1
            
    });
    
    afterEach(function () {
        client1.disconnect();
        client3.disconnect();
    });

    
    it("client dup gets list of users from server, including user 1", function () {
        client3.on("allUsers", function (users) {
            chai.expect(users[0].name).to.be("user 1");
            done();
        });
    });
    
    describe("client dup register as user 1", function () {
        
        beforeEach(function () {
            client3.emit("registerUser", "user 1");
        });
        
        
        it("client will get log message user 1 already exists", function (done) {
            client3.on("log", function (msg) {
                chai.expect(msg).to.be.equal("User 'user 1' already exists -- choose a different user name");
                done();
            });
        });

    });

                

               

});