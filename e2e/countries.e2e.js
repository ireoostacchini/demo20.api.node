const AddCountryDto = require('../app/dto/AddCountryDto');
const Str = require('@supercharge/strings');

/* eslint-disable no-undef */
const axios = require('axios').default;

describe('countries', () => {
  it('returns a list of countries', async (done) => {
    const result = await axios.get(`${process.env.BASE_URL}/countries`);

    const countries = result.data.countries;

    expect(result.status).toEqual(200);
    expect(countries.length).toBeGreaterThan(0);

    done();
  });

  //this can fail, as name and code must be unique. We'd need to set the data before each test
  it('adds a country', async (done) => {
    const countryToAdd = new AddCountryDto(Str.random(50), Str.random(3));

    const result = await axios.post(
      `${process.env.BASE_URL}/countries/add`,
      countryToAdd
    );

    const getCountriesResult = await axios.get(
      `${process.env.BASE_URL}/countries`
    );

    const countries = getCountriesResult.data.countries;

    expect(result.status).toEqual(200);

    const addedCountry = countries.find((x) => x.code === countryToAdd.code);

    expect(addedCountry.name).toEqual(countryToAdd.name);

    done();
  });
});
