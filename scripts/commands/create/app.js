const { exec } = require('child_process');
const inquirer = require('inquirer');
const { resolveAppDir } = require('../../utils/utils');
const ask = require('./prompts/setupDetails');
const chalk = require('chalk');
const logger = require('../../utils/logger');
const log = logger('boilerplate', 'yellow');

const boilerplateURLs = {
    'Blank Frontend': 'https://github.com/anto-christo/frappejs-boilerplate',
    'VueJS Frontend': 'https://github.com/anto-christo/frappejs-todomvc',
    'Only Server': 'https://github.com/anto-christo/frappejs-boilerplate'
}

let prefer = {
    boilerplate: undefined,
    electronSupport: false,
    packageManager: undefined
}

async function askBoilerplate() {
    return new Promise((resolve) => {
        inquirer.prompt(ask.boilerplate).then(async response => {
            prefer.boilerplate = response.boilerplate;
            resolve();
        });
    });
}

function askPackageManager() {
    return new Promise((resolve) => {
        inquirer.prompt(ask.packageManager).then(async response => {
            prefer.packageManager = response.packageManager;
            resolve();
        });
    });
}

module.exports = {
    askPreferences: async function() {
        await askBoilerplate();
        await askPackageManager();
    },

    cloneBoilerplate: async function(name) {
        const url = boilerplateURLs[prefer.boilerplate];
        return new Promise((resolve) => {
            exec(`git clone ${url} ${name}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                log(`${chalk.green('Application created successfully !!')}`);
                resolve();
            });
        })
    },

    installDependencies: async function(name) {
        let installCommand;
        if (prefer.packageManager === 'Skip this step') {
            installCommand = undefined;
            log(`${chalk.red('Installation of dependencies skipped')}`);
            log(`${chalk.blue('Install dependencies before running application')}`);
        } else {
            installCommand = prefer.packageManager === 'NPM' ? 'npm i' : 'yarn';
            return new Promise((resolve) => {
                log(`${chalk.blue('Installing dependencies, this may take a while.....')}`);
                exec(installCommand, { cwd: resolveAppDir(`./${name}`) }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    log(`${chalk.green('Dependencies installed successfully')}`);
                    log(`${chalk.blue('Run ')+ chalk.yellow('frappe start ')+ chalk.blue('at the root of new project to start the application in development server')}`);
                    resolve();
                });
            });
        }
    }
}