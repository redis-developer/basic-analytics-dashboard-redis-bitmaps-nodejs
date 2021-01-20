const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const di = require('./di');
const errorHandler = require('./plugins/errorHandler');
const config = require('./config');

const app = express();

require('express-async-errors');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const router = require('./routes')(di);

app.use('/', express.static(path.join(__dirname, '../dist')));

app.use('/api', router);

app.use(errorHandler);

const { port } = config.server;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
