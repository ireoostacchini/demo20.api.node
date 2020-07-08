var convict = require('convict');

//## Ensure config keys can be read from file AND from environment variable
//## Ensure config is hierarchical for easier findability
//## Config secrets should be kept outside committed code

//##  The application should fail as fast as possible and provide the immediate feedback if the required environment variables are not present at start-up
//  this can be achieved by using convict to validate the configuration

convict.addFormat(require('convict-format-with-validator').ipaddress);

var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'IP_ADDRESS',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
  logLevel: {
    doc: 'The log level',
    format: '*',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: '127.0.0.1',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: '',
    },
    user: {
      doc: 'Database user name',
      format: String,
      default: '',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: '',
    },
  },
});

// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./.env.' + env + '.json');

// Perform validation
config.validate({ allowed: 'strict' });

//here we put our settings into a config.settings object, so we don't need to deal with property name strings
config.settings = {};
for (const settingName in config.getSchema()._cvtProperties) {
  config.settings[settingName] = config.get(settingName);
}

module.exports = config;
