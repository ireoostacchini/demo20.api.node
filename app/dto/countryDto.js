class CountryDto {
  constructor(id, name, code, population = null) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.population = population;
  }
}

module.exports = CountryDto;
