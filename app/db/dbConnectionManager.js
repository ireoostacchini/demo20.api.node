const config = require('../../config');

const dbConnectionManager = (() => {
  getKnex = () => {
    var knex = require('knex')({
      client: 'pg',
      connection: {
        host: config.settings.db.host,
        database: config.settings.db.name,
        user: config.settings.db.user,
        password: config.settings.db.password,
      },
      searchPath: ['public'],
    });

    return knex;
  };

  return {
    getKnex,
  };
})();

module.exports = dbConnectionManager;
