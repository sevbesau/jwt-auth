const express = require('express');
const morgan = require('morgan');

const env = require('./env');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.use('/auth', require('./routes/auth'));

app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));
