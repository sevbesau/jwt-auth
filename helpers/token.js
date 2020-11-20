const jwt = require('jsonwebtoken');
const env = require('../env');

module.exports.generateTokenUser = (user) => ({
  _id: user._id,
  username: user.username,
});

module.exports.generateAccesToken = (user) => jwt.sign(user, env.accesTokenSecret, { expiresIn: '1m' });
