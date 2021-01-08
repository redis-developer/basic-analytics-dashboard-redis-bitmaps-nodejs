const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

require('./plugins/dayjs')();

const router = require('./routes')(app);

app.use('/api', router);

module.exports = app;
