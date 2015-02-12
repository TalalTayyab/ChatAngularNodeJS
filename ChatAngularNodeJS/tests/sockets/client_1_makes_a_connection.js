var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;


base.describe("client 1 makes a connection", function () {
    
    
    var client1;
    beforeEach(function (done) {
        //remove all the users
        Users.removeAll();
        
        client1 = base.connect();
        done();
      
            
    });
    
    afterEach(function () {
        client1.disconnect();
    });
    
    it('client can connect', function (done) {
        
        client1.on('connect', function (data) {
            done();
            
        });


    });//it
    
    it('client 1 gets list of existing users on the server', function (done) {
        
        client1.emit("newClient");

        client1.on("allUsers", function (users) {
            
            chai.assert(Array.isArray(users), "users must be array");
            done();
        });

            

        
    });//it


});




