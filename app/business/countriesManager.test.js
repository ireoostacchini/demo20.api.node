const CountryDto = require('../dto/countryDto');

const models = [
  new CountryDto(1, 'Italy', 'ITA'),
  new CountryDto(2, 'UK', 'ENG'),
  new CountryDto(3, 'France', 'FRA'),
];

const mockDb = {
  countriesRepository: {
    getCountries: jest.fn(() => models),
  },
};

const mockApi = {
  populationApiClient: {
    getPopulations: jest.fn((x) => []),
  },
};

const countriesManager = require('./countriesManager')(mockDb, mockApi);

describe('countriesManager', () => {
  it('can get countries', async () => {
    const result = (await countriesManager.getCountries()).countries;

    expect(result.length).toEqual(3);
  });
});
