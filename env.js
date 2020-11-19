const env = {
  port: '3000',
  mongoUri: 'mongodb://localhost:27017/jwt-auth',
};

require('envalidation')(env);

module.exports = env;
