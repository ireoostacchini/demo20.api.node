const Joi = require('@hapi/joi');
const swagger = require('swagger-spec-express');
const BadRequestError = require('../errors/BadRequestError');

const addCountrySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  code: Joi.string().alphanum().length(3).required(),
});

swagger.common.addModel({
  name: 'countryResponse',
  type: 'object',
  properties: {
    countries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
  },
});

//## we use the revealing module pattern to implement controllers
//## Code should be stateless (ie not have variable state)
//## Name all functions - this makes it easier to debug  memory dumps
//## Adopt a layered, 'clean' architecture
//  - ie controller / business / model, with dependencies pointing one way only
//  - business has infrastructure (eg database access code, gateways to other APIs) injected in
//## Keep Express within its boundaries (we let the router into the controller layer, but no further)
const countriesController = (() => {
  registerRoutes = (router, business, db, api, logger) => {
    router
      .post('/countries', async (req, res, next) => {
        //## wrap all routes with a catch
        try {
          //## Fail fast, validate incoming JSON schemas using a dedicated library (Joi)
          try {
            await addCountrySchema.validateAsync({
              name: req.body.name,
              code: req.body.code,
            });

            logger.info('adding a country');
          } catch (err) {
            next(new BadRequestError(err.message));
          }

          res.json(
            await business
              .countriesManager(db, api)
              .addCountry(req.body.name, req.body.code)
          );
        } catch (err) {
          if (err.constraint === 'UX_Code') {
            next(new BadRequestError('Duplicate country code'));
          }
          if (err.constraint === 'UX_Name') {
            next(new BadRequestError('Duplicate country name'));
          }
          next(err);
        }
      })
      .describe({
        responses: {
          201: {
            description: 'Add a country',
          },
          400: {
            description: 'Bad request',
            model: 'errorResponse',
          },
        },
      });

    router
      .get('/countries', async (req, res, next) => {
        try {
          logger.info('got countries!');
          //req has a traceId property - we may want to allow logging at business logic level
          res.json(await business.countriesManager(db, api).getCountries());
        } catch (err) {
          next(err);
        }
      })
      .describe({
        responses: {
          200: {
            description: 'Returns countries',
          },
        },
      });

    //we need this route to make swagger work
    router.get('/', function (req, res, next) {
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

module.exports = countriesController;
