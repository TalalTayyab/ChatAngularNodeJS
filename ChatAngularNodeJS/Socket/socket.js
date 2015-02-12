var socketio = require("socket.io");
var _ = require("underscore");
var s = require("underscore.string");
var Users = require("./users.js");

(function (socket) {
    

    
    socket.init = function (server) {
        
        var chatRoom = "chat";
        var systemName = "SYSTEM";
        var io = socketio.listen(server);
        
        io.sockets.on("connection", function (socket) {
           
            
            //socket.emit
            //socket.broadcast
            
            //recieved message - new client
            socket.on("newClient", function () {
                console.log("[SERVER] newClient");
                //send list of users to this clients.
                
                send_allUsers(socket, false);
            });//
            
            //recieved message - register user
            socket.on("registerUser", function (name) {
               //console.log("[SERVER] registerUser " + name);
                var u = { name: name };
                if (!Users.contains(name)) {
                    //if user does not exist 
                   
                    
                    //add user
                    Users.add(u);
                 
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
                
                
                if (Users.contains(name)) {
                    
                    Users.remove(name);
                    //update all clients
                    send_allUsers(socket, true);
                    send_logMessage(socket, s.sprintf("User '%s' has been logged out", name));
                    send_chat(socket, systemName, s.sprintf("User '%s' has left", name));

                } else {

                }                ;
            });
            
            
            socket.on("chat", function (name, text) {
                

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

 
  