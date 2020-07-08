var swagger = require("swagger-spec-express");

const homeController = (() => {
  registerRoutes = (router) => {
    //we need this route to make swagger work
    router.get("/", function (req, res, next) {
      try {
        res.json({});
      } catch (err) {
        next(err);
      }
    });
  };

  return {
    registerRoutes,
  };
})();

module.exports = homeController;
