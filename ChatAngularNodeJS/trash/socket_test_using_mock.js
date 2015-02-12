var chai = require("chai");
var rewire = require("rewire");
var _ = require("underscore");
var s = require("underscore.string");
var socket = rewire("../socket/socket.js");
var users = require("../socket/users.js");
users.clear = function () {

};


socket.__set__("Users", users);







//socketModule.init();



//var EventHandler = function () {
//    this.events = [];
//};

//EventHandler.prototype.addEvent = function (name, callback) {
//    var newEvent = {
//        name: name,
//        callback: callback
//    };
//    this.events.push(newEvent);
//};

//EventHandler.prototype.getEvent = function (name) {
//    var eventFound = _.find(this.events, function (e) {
//        return e.name === name;
//    });
    
//    return eventFound;
//};


////Mock Socket class
//var MockSocket = function (serverMode) {
    
    
    
//    this.id = ++MockSocket.currentId;
//    this.isServer = serverMode;
//    this.events = new EventHandler();
    
//    //move this to class level
//    this.clientSockets = [];
    
    
    
//    this.broadcast = {
//        socket: this,
//        emit: function (name) {
//            this.socket.sendToAllExcept(name, this.socket);
//        }
//    };
//}
//MockSocket.currentId = 0;



////save the event handler
//MockSocket.prototype.on = function (name, callback) {
//    this.events.addEvent(name, callback);
//};

////send the event for the specific socket
//MockSocket.prototype.emit = function (name) {
    
//    var args = [].splice.call(arguments, 1, arguments.length - 1);

//    if (this.isServer) {
//        //if server send to all clients
//        this.sendToAll(name, args);
//    } else {
//        this.callEvent(name, this, args);
      
//    }    ;
   
//    //e.callback(arguments);
//};

//MockSocket.prototype.callEvent = function (name, sock, args) {
//    var e = sock.events.getEvent(name);
//    var callback = null;
    
//    if (e == null) {
//        console.log("event " + name + " could not be found");
//    } else {
//        //get arguments here
//        e.callback.apply(this,args);
//    }
//}

//MockSocket.prototype.connection = function (socket) {
    
//    this.callEvent("connection", this, [socket]);
    
//}


//MockSocket.prototype.connect = function () {
//    var sock = new MockSocket(false);
//    this.clientSockets.push(sock);
    
//    this.connection(sock);
    
//    return sock;
//};

////send to all sockets
//MockSocket.prototype.sendToAll = function sendToAll(name, args) {
//    this.sendEvent(name, this.clientSockets, args)
//};

////send events to all items in the collection
//MockSocket.prototype.sendEvent = function (name, lst, args) {
//    var self = this;
//    _.each(lst, function (sock) {
        
//        //sock.emit(name);
//        self.callEvent(name, sock, args);
//    });
//};

////send to all except the passed socket
//MockSocket.prototype.sendToAllExcept = function (name, inSock,args) {
//    var items = _.filter(this.clientSockets, function (sock) {
//        return sock !== inSock;
//    });
    
//    this.sendEvent(name, items,args);

//};

//MockSocket.prototype.disconnect = function (){
//    this.id = -1;
//    this.events = new EventHandler();
//}

////server
//var socketio = {
//    io: {
//        sockets: new MockSocket(true)//server
//    },
//    listen: function (server) {
//        return this.io;
//    },
//};



////client
//var io = {
//    connect: function () {
//        return socketio.io.sockets.connect();
//    }
//};



//socketModule.__set__("socketio", socketio);

//socketModule.init();

//var client1 = io.connect();

//var client2 = io.connect();

//function allUser(users){
   
//    var str = "";
//    _.each(users, function (u) {
//        str += u.name + ", ";
//    });
//    console.log(s.sprintf("[%s] [USERS] %s", this.id, str));
//};

//function userRegistered(user){
//    console.log(s.sprintf("[%s] [USER REGISTERED]: %s",this.id,user.name));
//};

//function chat(name, text){
//    console.log(s.sprintf("[%s] [CHAT] %s:%s",this.id,name,text));
//};

//function log(msg){
//    console.log(s.sprintf("[%s] [LOG] %s",this.id,msg));
//}


////client 1
//client1.on("allUsers", allUser);
//client1.on("userRegistered", userRegistered);
//client1.on("chat", chat);
//client1.on("log", log);

////client 2
//client2.on("allUsers", allUser);
//client2.on("userRegistered", userRegistered);
//client2.on("chat", chat);
//client2.on("log", log);


//client1.emit("newClient");

//client1.emit("registerUser", "user 1");

//client2.emit("newClient");

//client2.emit("registerUser", "user 2");

//client1.emit("chatServer", "user 1", "message from user 1");

//client2.emit("chatServer", "user 1", "message from user 2");

//client1.emit("logOut", "user 1");

//client2.emit("logOut", "user 2");


//describe("Test Chat", function () {
    
//    before(function () {
//        socketModule.__set__("socketio", socketio);
//        socketModule.init();

//    });
    
//    it('client socket is connected', function () {
        
//        var client1 = io.connect();
//        chai.expect(client1.id).to.be.above(0);
 
//    });//it


//    it('sends list of all users when newclient message comes', function (done) {
//        var client1 = io.connect();
        
//        client1.on("allUsers", function (users) {
            
//            chai.assert(Array.isArray(users), "users must be array");
//            done();
//        });
        
//        client1.emit("newClient");
//    });//it
    


//    describe("when client registers a new user", function () {
//        var client1;
        
//        //before running each test
//        //Create a new connection
//        //On connection ->
//        //  send the new client message
//        //  send the register user message
//        beforeEach(function () {
            
//            client1 = io.connect();
            

            
//        });
        
//        afterEach(function () {
//           client1.disconnect();
//        });
        
//        it("sends the user registered message", function (done) {
            
//            //client1.on("allUsers", allUsers);
//            client1.on("userRegistered", function (user) {
//                chai.expect(user.name).to.equal("user 1");
//                done();
//            });

//            client1.emit("newClient");
//            client1.emit("registerUser", "user 1");

            
//        });//it
        
//        it("sends the new user message", function (done) {
//            client1.on("newUser", function (user) {
//                chai.expect(user.name).to.equal("user 1");
//                done();
//            });

//            client1.emit("newClient");
//            client1.emit("registerUser", "user 1");
//        });
        
//        it("sends the chat message", function (done) {
//            client1.on("chat", function (name, text) {
//                chai.expect(name).to.equal("SYSTEM");
//                chai.expect(text).to.equal("User 'user 1' has joined the chat");
//                done();
//            });

//            client1.emit("newClient");
//            client1.emit("registerUser", "user 1");
//        });
        
//        it("sends the log message", function (done) {
//            client1.on("log", function (msg) {
//                chai.expect(msg).to.equal("User 'user 1' added");
//                done();
//            });

//            client1.emit("newClient");
//            client1.emit("registerUser", "user 1");
//        });

//    });//describe register user







//});
