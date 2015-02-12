//users.js
(function (exports) {
    
    var _ = require("underscore");
    
    //collection of users
    var users = [];
    
    //returns the list of users filtered by name
    function getUsers(name) {
        return _.filter(users, function (u) {
            return name == null || name === u.name;
        });
    }    ;
    
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
    }    ;
    
    function clear(){
        users = [];
    }
    
    exports.select = getUsers;
    exports.add = addUser;
    exports.remove = removeUser;
    exports.contains = exists;
    exports.removeAll = clear;


})(module.exports);//IFFY