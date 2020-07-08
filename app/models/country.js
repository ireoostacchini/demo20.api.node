class Country {
  constructor(id, name, code) {
    this._id = id;
    this._name = name;
    this._code = code;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get code() {
    return this._code;
  }
}

module.exports = Country;
