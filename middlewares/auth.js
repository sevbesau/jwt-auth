const jwt = require('jsonwebtoken');
const env = require('../env');

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accesToken = authHeader.split(' ')[1];
  if (!accesToken) return res.sendStatus(400);

  return jwt.verify(accesToken, env.accesTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });
};
