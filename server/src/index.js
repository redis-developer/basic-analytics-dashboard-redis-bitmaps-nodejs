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
app.use(
    cors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true
    })
);
app.use(bodyParser.json());

const router = require('./routes')(di);

app.use('/', express.static(path.join(__dirname, '../../client-dist')));

app.use('/api', router);

app.use(errorHandler);

const { port } = config.server;

di.get('services.data.sample')
    .generate()
    .then(() => {
        console.log('Sample data loaded...');

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    });
