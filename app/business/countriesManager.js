const CountryDto = require('../dto/countryDto');

const countriesManager = (db, api) => {
  //## use async/await to catch errors (ie avoid callbacks)
  getCountries = async () => {
    const models = await db.countriesRepository.getCountries();

    const modelCodes = models.map((x) => x.code);

    //superfluous api call - just to demonstrate the pattern
    var populationResult = await api.populationApiClient.getPopulations(
      modelCodes
    );

    const dtos = models.map((country) => {
      return new CountryDto(
        country.id,
        country.name,
        country.code,
        populationResult[country.code]
      );
    });

    return { countries: dtos };
  };

  addCountry = async (name, code) => {
    const addedCountry = await db.countriesRepository.addCountry(name, code);

    var populationResult = await api.populationApiClient.getPopulations([code]);

    return new CountryDto(
      addedCountry.id,
      addedCountry.name,
      addedCountry.code,
      populationResult[addedCountry.code]
    );
  };

  return {
    getCountries,
    addCountry,
  };
};

module.exports = countriesManager;
