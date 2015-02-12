var rewire = require("rewire");
var chai = require("chai");
var io = require("socket.io-client");
var http = require("http");
var _ = require("underscore");

var socket = rewire("../socket/socket.js");
var Users = require("../socket/users.js");

describe("When server is listening", function () {
    
    var socketURL = 'http://localhost:3000';
    
    var options = {
        transports: ['websocket'],
        'force new connection': true
    };
    
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
    
    describe("client 1 makes a connection", function () {
        
        //important to disconnect after test otherwise they will get other test messages
        var client1;
        beforeEach(function () {
            //remove all the users
            Users.removeAll();
            
            client1 = io.connect(socketURL, options);
            
            client1.on('connect', function (data) {
                client1.emit("newClient");
             });//client1
            
        });
        
        afterEach(function () {
            client1.disconnect();
        });
        
        it('client can connect', function (done) {
        
            client1.on('connect', function (data) {
                done();
            //client1.emit("newClient");
            });
        
        
        });//it
        
        it('client 1 gets list of existing users on the server', function (done) {
        
            client1.on("allUsers", function (users) {
        
                chai.assert(Array.isArray(users), "users must be array");
                done();
            });
        
        });//it
        
       
    });//describe user 1 makes a connection
    
    
    
    
    describe("client 1 registers as User 1", function () {
        
        beforeEach(function () {
            client1.emit("registerUser", "user 1");
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
    
    
    describe("client 2 makes a connection", function () {
        var client2;
        
        beforeEach(function () {
            client2 = io.connect(socketURL, options);
            
            client2.on('connect', function () {
                
                client2.emit("newClient");
                        

            });//beforeEach
        });
        
        afterEach(function () {
            client2.disconnect();
        });
        
        it("gets list of users", function (done) {
            
            client2.on("allUsers", function (users) {
                //      chai.expect(users.length).to.be.equal(1);
                //      chai.expect(users[0].name).to.be.equal('user 1');
                done();
            });
        });

    });//describe client 2

    
    describe("client dup makes a connection", function () {
        var client3;
        
        beforeEach(function () {
            client3 = io.connect(socketURL, options);
            client3.on('connect', function () {
                client3.emit("newClient");
                        
            });

        });//beforeEach
        
        afterEach(function () {
            client3.disconnect();
        })
        
        it("client dup gets list of users from server, including user 1", function (done) {
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
    
   


});