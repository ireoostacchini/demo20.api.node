const populationApiClient = (() => {
  //we fake the actual api call - we just want to show the architectural pattern for calling other APIs
  getPopulations = async (countryCodes) => {
    result = {};

    countryCodes.forEach((code) => {
      result[code] = getPopulation(code);
    });

    return result;
  };

  getPopulation = (countryCode) => {
    switch (countryCode) {
      case 'GBR':
        return 66000000;
      case 'ITA':
        return 60000000;
      default:
        return null;
    }
  };

  return {
    getPopulations,
  };
})();

module.exports = populationApiClient;
