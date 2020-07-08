const swagger = require("swagger-spec-express");
const swaggerUi = require("swagger-ui-express");
const packageJson = require("../package.json");

const swaggerManager = (() => {
  setupSwagger = (app) => {
    swagger.initialise(app, {
      title: packageJson.title,
      version: packageJson.version,
    });

    //## Document API errors using Swagger or GraphQL
    //commonly-used models here; controller-specific ones are in the controllers themselves
    swagger.common.addModel({
      name: "errorResponse",
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
            },
            message: {
              type: "string",
            },
            status: {
              type: "number",
            },
          },
        },
      },
    });

    //this is required for swagger to work
    app
      .get("/swagger.json", function (err, res) {
        res.status(200).json(swagger.json());
      })
      .describe({
        responses: {
          200: {
            description: "Returns the swagger.json document",
          },
        },
      });

    swagger.compile();

    var options = {
      swaggerOptions: {
        url: "/swagger.json",
      },
    };

    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(null, options));
  };

  return {
    setupSwagger,
  };
})();

module.exports = swaggerManager;
