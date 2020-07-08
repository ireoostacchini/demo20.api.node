const business = (() => {
  countriesManager = require('./countriesManager');

  return {
    countriesManager,
  };
})();

module.exports = business;
