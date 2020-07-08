//##When developing a module/library in a folder, place an index.js file that exposes the module's internals so every consumer will pass through it.
//  - This serves as an 'interface' to your module and eases future changes without breaking the contract

const controllers = (() => {
  const registerRoutes = (router, business, db, api, logger) => {
    require('./homeController').registerRoutes(router);
    require('./countriesController').registerRoutes(
      router,
      business,
      db,
      api,
      logger
    );
    require('./errorController').registerRoutes(router, business);
  };

  return {
    registerRoutes,
  };
})();

module.exports = controllers;
