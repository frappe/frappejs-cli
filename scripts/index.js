#!/usr/bin/env node

const program = require('commander');
const process = require('process');
const package = require('../package.json');
const run = require('./commands');
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
    .action((mode) => {
        run.startApp(mode);
    });

program
    .command('build [mode]')
    .description('Build assets for production')
    .action((mode) => {
        run.buildApp(mode);
    });
    
program
    .command('create-model <name>')
    .description('Create a new model in the `models/doctype` folder')
    .action((name) => {
        run.newModel(name);
    });

program
    .command('create-app <name> [url]')
    .description('Create a frappejs app')
    .action((name, url) => {
        run.newApp(name, url);
    });

program.parse(process.argv);