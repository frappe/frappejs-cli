const { exec } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { resolveAppDir } = require('../../utils/utils');
const details = require('./prompts/setupDetails');
const { logger, clear } = require('../../utils/logger');
const log = logger('cli', 'yellow');

let appName = undefined;

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

async function ask(question) {
    clear();
    return new Promise((resolve) => {
        inquirer.prompt(details[question]).then(async response => {
            prefer[question] = response[question];
            resolve();
        });
    });
}

module.exports = {
    checkIfExists: async function(name) {
        appName = name;
        if (fs.existsSync(resolveAppDir(`./${name}`))) {
            log(`${chalk.red(`App with name ${name} already exists in the current directory`)}`);
            process.exit(1);
        }
    },

    askPreferences: async function() {
        await ask('boilerplate');
        await ask('packageManager');
    },

    cloneBoilerplate: async function() {
        clear();
        const url = boilerplateURLs[prefer.boilerplate];
        return new Promise((resolve) => {
            exec(`git clone ${url} ${appName}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                log(`${chalk.green('Application created successfully !!')}`);
                resolve();
            });
        })
    },

    installDependencies: async function() {
        let installCommand;
        if (prefer.packageManager === 'Skip this step') {
            installCommand = undefined;
            log(`${chalk.red('Installation of dependencies skipped')}`);
            log(`${chalk.blue('Install dependencies before running application')}`);
        } else {
            installCommand = prefer.packageManager === 'NPM' ? 'npm i' : 'yarn';
            return new Promise((resolve) => {
                log(`${chalk.blue('Installing dependencies, this may take a while.....')}`);
                exec(installCommand, { cwd: resolveAppDir(`./${appName}`) }, (error, stdout, stderr) => {
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