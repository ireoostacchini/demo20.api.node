const CountryDto = require("../dto/countryDto");

const countryMapper = (() => {
  modelToDto = (country) => {
    return new CountryDto(country.id, coumtry.name);
  };

  return {
    modelToDto,
  };
})();

module.exports = countryMapper;
