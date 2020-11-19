const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const env = require('./env');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.use('/auth', require('./routes/auth'));

app.listen(env.port, () => console.log(`[express] running at http://localhost:${env.port}`));

mongoose
  .connect(env.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('[mongodb] connected'))
  .catch((error) => console.log(`[mongodb] connection failed...\n${error}`));
