const db = (() => {
  countriesRepository = require('./countriesRepository');

  return {
    countriesRepository,
  };
})();

module.exports = db;
