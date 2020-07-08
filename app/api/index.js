//we'll want to pass paramEters into this function - eg baseUrl, credentials
const api = (() => {
  populationApiClient = require('./populationApiClient');

  return {
    populationApiClient,
  };
})();

module.exports = api;
