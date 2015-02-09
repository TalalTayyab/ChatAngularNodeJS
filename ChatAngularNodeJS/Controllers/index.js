(function (controllers) {

    var homeController = require("./homeController.js");
    var apiController = require("./apiController.js");
    

    controllers.init = function (app) {

        homeController.init(app);
        apiController.init(app);
    };

})(module.exports);