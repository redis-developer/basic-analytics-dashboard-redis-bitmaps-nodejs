const app = require('./app');
const config = require('./config');

const { port } = config.server;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
