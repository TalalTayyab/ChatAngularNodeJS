(function (socket) {
    
    var socketio = require("socket.io");
    var _ = require("underscore");
    var s = require("underscore.string");
    
    var Users = (function () {
        
        //collection of users
        var users = [];
        
        //returns the list of users filtered by name
        function getUsers(name) {
            return _.filter(users, function (u) {
                return name == null || name === u.name;
            });
        }        ;
        
        //add a new user
        function addUser(user) {
            users.push(user);
        }
        
        
        //remove used based on the passed name
        function removeUser(name) {
            users = _.filter(users, function (u) {
                return u.name !== name;
            });
        }
        
        function exists(name) {
            return getUsers(name).length > 0;
        }        ;
        
        return {
            select: getUsers,
            add: addUser,
            remove: removeUser,
            contains: exists
        };

    })();//IFFY
    
    socket.init = function (server) {
        
        var chatRoom = "chat";
        var systemName = "SYSTEM";
        var io = socketio.listen(server);
        
        io.sockets.on("connection", function (socket) {
            console.log("socket connected");
            
            //socket.emit
            //socket.broadcast
            
            //recieved message - new client
            socket.on("newClient", function () {
                //send list of users to this clients.
                
                send_allUsers(socket, false);
            });//
            
            //recieved message - register user
            socket.on("registerUser", function (name) {
                console.log("registerUser " + name);
                var u = { name: name };
                if (!Users.contains(name)) {
                    //if user does not exist 
                   
                    
                    //add user
                    Users.add(u);
                    
                    //join the global room
                    //socket.join(chatRoom);

                    //send messages
                    
                    //tell calling client, user has been registered.
                    send_userRegistered(socket, u);
                    //tell all clients, new user has been added
                    send_newUser(socket, u);
                    //send chat message
                    send_chat(socket, systemName, s.sprintf("User '%s' has joined the chat", u.name));
                    //send log message
                    send_logMessage(socket, s.sprintf("User '%s' added", u.name));

                } else {
                    
                    
                    //send log message
                    send_logMessage(socket, s.sprintf("User '%s' already exists -- choose a different user name", u.name));
                }                ;
                
                 
            });//on register user
            
            
            socket.on("logOut", function (name) {
                console.log("logOut " + name);
                
                if (Users.contains(name)) {
                    
                    Users.remove(name);
                    //update all clients
                    send_allUsers(socket, true);
                    send_logMessage(socket, s.sprintf("User '%s' has been removed", name));
                    send_chat(socket, systemName, s.sprintf("User '%s' has left", name));

                } else {

                }                ;
            });
            
            
            socket.on("chat", function (name, text) {
                console.log(s.sprintf("(new message) %s: %s", name, text));

                send_chat(socket,name, text);
            });
           

        });//on
        
        
        function send_allUsers(socket, broadcast) {
            if (broadcast) {
                //socket.broadcast.emit("allUsers", Users.select());
                io.sockets.emit("allUsers", Users.select());
            } else {
                socket.emit("allUsers", Users.select());
            }            ;
            
        }        ;
        
        function send_userRegistered(socket, u) {
            socket.emit("userRegistered", u);
        }        ;
        
        function send_newUser(socket, u) {
            socket.broadcast.emit("newUser", u);
        }        ;
        
        function send_chat(socket, name, text) {
           
            io.sockets.emit("chat", name,text);
           // io.sockets.in(chatRoom).emit("chat",name,text);
        }        ;
        
        function send_logMessage(socket, msg) {
            socket.emit("log", msg);
        };

      
       
        
    };//init


})(module.exports);