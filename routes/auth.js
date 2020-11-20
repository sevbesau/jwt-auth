const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require('../env');
const Users = require('../models/users');
const Sessions = require('../models/sessions');
const { generateAccesToken, generateTokenUser } = require('../helpers/token');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/*
  when user logs in he gets a refresh token and an accesToken.
  The acces token is used to gain acces to the server, but is only valid for a short time.
  The refresh token can then be used to obtain a new acces token,
  and will only be invalidated when the user logs out.
*/

// get token
// refresh token
router.get('/', authenticateToken, (req, res) => {
  if (!req.user) return res.sendStatus(403);
  return res.sendStatus(200);
});

router.post('/token', async (req, res) => {
  if (!req.body.token) return res.sendStatus(400);
  const token = await Sessions.findOne({ token: req.body.token });
  if (!token) return res.sendStatus(403);
  return jwt.verify(token.token, env.refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    const accesToken = generateAccesToken(generateTokenUser(user));
    return res.json({ accesToken });
  });
});

router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) return res.sendStatus(400);
  const exists = await Users.findOne({ username: req.body.username });
  if (exists) return res.sendStatus(403);

  const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt(8));
  const newUser = await Users({
    username: req.body.username,
    password: hashedPassword,
  }).save();

  res.status(200);
  return res.json(newUser);
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) return res.sendStatus(400);

  const user = await Users.findOne({ username: req.body.username });
  if (!user) return res.sendStatus(403);
  if (!(await bcrypt.compare(req.body.password, user.password))) return res.sendStatus(403);

  const tokenUser = generateTokenUser(user);
  const accesToken = generateAccesToken(tokenUser);
  const refreshToken = jwt.sign(tokenUser, env.refreshTokenSecret);
  await Sessions({ token: refreshToken }).save();

  res.status(200);
  return res.json({ accesToken, refreshToken });
});

router.post('/logout', async (req, res) => {
  // TODO check if token is in session db
  if (!req.body.token) return res.sendStatus(400);
  await Sessions.findOneAndDelete({ token: req.body.token });
  return res.sendStatus(200);
});

module.exports = router;
