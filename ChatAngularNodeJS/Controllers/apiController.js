(function (apiController) {

    apiController.init = function (app) {
        app.get("/api", function (req, res) {
            res.set("Content-Type", "application/json");
            res.send({ message: 'sent a test object' });
        });
    };

})(module.exports);