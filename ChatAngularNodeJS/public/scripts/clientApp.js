/// <reference path="angular.js" />


(function () {
    
    
    var app = angular.module('chatApp', ['luegg.directives']);
    //app.value('$', $);
    
    //when the window unloads - send a logout click event
    window.onbeforeunload = function () {
        $("#btnLogOut").click();
    };
    
    
    app.controller("chatCtrl", function ($scope) {
        
        $scope.name = null;
        $scope.text = null;
        
        //chat messages
        $scope.messages = [];
        
        //log messages
        $scope.logMessages = [];
        
        //registered users
        $scope.users = [];
        
        //set to true if user has been registered
        $scope.isUserRegistered = false;
        
        
        //get the socket
        var socket = io.connect();
        
        function send_newClient() {
            socket.emit("newClient");
        }
        
        //on event handlers
        socket.on("allUsers", allUsers);
        socket.on("userRegistered", userRegistered);
        socket.on("newUser", newUser);
        socket.on("chat", chat);
        socket.on("log", logMessage);
        //socket.on("chatMessage", chatMessage);
        
        //send new client message
        send_newClient();
        
        
        
        
        //recieve a chat message 
        function chat(name, text) {
            if ($scope.isUserRegistered) {
                console.log($scope.isUserRegistered);
                $scope.$apply(function () {
                    
                    $scope.messages.push({ name: name, text: text });

                });
            }
            

        }        ;
        
        //recieve message - to get details of all users
        function allUsers(users) {
            
            $scope.$apply(function () {
                if (users !== null || users.length >= 0) {
                    $scope.users = users;
                }
                else {
                    $scope.users = [];

                }                ;


            });
        }        ;
        
        //recieve - new user is registered.
        function newUser(user) {
            $scope.$apply(function () {
                $scope.users.push(user);
            });
        }        ;
        
        //recieve - log message
        function logMessage(msg) {
            
            $scope.$apply(function () {
                
                //before adding new message, see if its a duplicate
                var newMessage = true;
                angular.forEach($scope.logMessages, function (item) {
                    //if message found, increment the count
                    if (item.msg === msg) {
                        item.count++;
                        newMessage = false;
                    }                    ;
                });
                
                //if new message add it
                if (newMessage) {
                    $scope.logMessages.push({ msg: msg, count: 1 });
                }


            });

        }        ;
        
        
        //recieve message - user has been registered.
        function userRegistered(user) {
            
            $scope.$apply(function () {
                $scope.isUserRegistered = true;
            });
        }        ;
        
        
        
        //send message to server.
        $scope.sendMessage = function () {
            //chat.server.send($scope.name, $scope.text);
            socket.emit("chat", $scope.name, $scope.text);
            $scope.text = "";
        };
        
        //send message -register a new user
        $scope.registerUser = function () {
            // chat.server.registerUser($scope.name);
            socket.emit("registerUser", $scope.name);
        }
        
        //send message - logout
        $scope.logOut = function () {
            //chat.server.logOut($scope.name);
            socket.emit("logOut", $scope.name);
            
            $scope.isUserRegistered = false;
            //refresh users list from the server
            send_newClient();
        }
        
        
        
        
      




    });//controller
    
    
    
    //register a directive
    
    app.directive('validUserName', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {
                function isValid(value) {
                    
                    var isValid = true;
                    
                    value = value || "";
                    value = value.trim();
                    
                    var re = /^[a-z0-9]+$/i;
                    isValid = re.test(value);
                    return isValid;
                }
                //value changed
                ngModel.$parsers.unshift(function (value) {
                    ngModel.$setValidity('validUserName', isValid(value));
                    return value;
                });
                //initial load
                ngModel.$formatters.unshift(function (value) {
                    ngModel.$setValidity('validUserName', isValid(value));
                    return value;
                });
            }
        }
    });






}());