var chai = require("chai");
var io = require("socket.io-client");
var _ = require("underscore");
var base = require("./base.js");
var Users = base.Users;

base.describe("client 2 makes a connection", function () {
    
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
                        done();
                    });//client1
                });

              

     
            });
               
        });//client1

            
    });//beforeEach
    
    afterEach(function () {
        client1.disconnect();
        client2.disconnect();
    });
    
    it("client 2 gets list of users", function (done) {
        client2.on("allUsers", function (users) {
            chai.expect(users.length).to.be.equal(1);
            chai.expect(users[0].name).to.be.equal('user 1');
            done();
        });
    });
    
    
    

    


   

});//describe client 2