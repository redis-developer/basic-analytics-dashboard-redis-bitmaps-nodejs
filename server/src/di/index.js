const { ContainerBuilder, JsFileLoader } = require('node-dependency-injection');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');

const container = new ContainerBuilder(true, srcDir);
const loader = new JsFileLoader(container);

const loadFiles = (currentDirectory = '') => {
    const currentLocation = path.join(__dirname, currentDirectory);
    const allFiles = fs.readdirSync(currentLocation);
    const directories = allFiles.filter(file => !file.includes('.'));
    const files = allFiles.filter(file => file.includes('.'));

    for (const file of files) {
        const fileName = file.split('.')[0];

        if (fileName === 'index' && !currentDirectory) {
            continue;
        }

        loader.load(path.join(currentLocation, `${fileName}.js`));
    }

    for (const directory of directories) {
        loadFiles(path.join(currentDirectory, directory));
    }
};

loadFiles();

module.exports = container;
