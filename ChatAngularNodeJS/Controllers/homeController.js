(function (homeController) {

    homeController.init = function (app) {
        app.get("/About", function (req, res) {
            res.render("About", { title: 'chat' });
        });
    };

})(module.exports);