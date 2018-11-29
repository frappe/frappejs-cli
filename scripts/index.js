#!/usr/bin/env node

const program = require('commander');
const process = require('process');
const package = require('../package.json');
const create = require('./commands/create');
const { isValidDir } = require('./utils/utils');

(function init() {
    if (process.argv[2] !== 'create-app') {
        isValidDir();
    }
})();

program
    .version(package.version)

program
    .command('start [mode]')
    .description('Start development server')
    .action(require('./commands/start'))

program
    .command('build [mode]')
    .description('Build assets for production')
    .action(require('./commands/build'))

program
    .command('create-model <name>')
    .description('Create a new model in the `models/doctype` folder')
    .action((name) => {
        create.newModel(name);
    });

program
    .command('create-app <name>')
    .description('Create a frappejs app')
    .action((name) => {
        create.newApp(name);
    });

program.parse(process.argv);