const Country = require('../models/country');
const dbConnectionManager = require('./dbConnectionManager');

const countriesRepository = (() => {
  const knex = dbConnectionManager.getKnex();

  getCountries = async () => {
    const countries = await knex('Countries');

    const result = countries.map((country) => {
      return new Country(country.id, country.name, country.code);
    });

    return result;
  };

  addCountry = async (name, code) => {
    const id = await knex('Countries')
      .insert({
        name: name,
        code: code,
      })
      .returning('id');

    //https://stackoverflow.com/questions/43465266/knex-does-not-return-insert-id
    return new Country(id[0], name, code);
  };

  return {
    getCountries,
    addCountry,
  };
})();

module.exports = countriesRepository;
