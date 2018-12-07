const { exec } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { resolveAppDir } = require('../../utils/utils');
const details = require('./prompts/setupDetails');
const { logger, clear, display } = require('../../utils/logger');
const error = logger('\nError:\n', 'red');

let appName = undefined, appSpinner, depSpinner;

const boilerplateURLs = {
    'Blank': 'https://github.com/anto-christo/frappejs-boilerplate',
    'VueJS': 'https://github.com/anto-christo/frappejs-todomvc',
    'Server': 'https://github.com/anto-christo/frappejs-boilerplate'
}

let prefer = {
    boilerplate: undefined,
    targetPlatform: undefined,
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

async function startDepInstall(installCommand) {
    depSpinner = ora('Installing dependencies').start();
    return new Promise((resolve) => {
        exec(installCommand, { cwd: resolveAppDir(`./${appName}`) }, (errorMsg) => {
            if (errorMsg) {
                depSpinner.fail();
                error(chalk.red(errorMsg));
                return;
            }
            depSpinner.succeed();
            ora('Application created successfully !!').succeed();
            display(`$ cd ${appName}|$ frappe start ${execMode()}`);
            resolve();
        });
    });
}

function execMode() {
    return prefer.targetPlatform === 'Electron' ? 'electron' : '';
}

module.exports = {
    checkIfExists: async function(name) {
        appName = name;
        if (fs.existsSync(resolveAppDir(`./${name}`))) {
            error(chalk.red(`App with name ${name} already exists in the current directory`));
            process.exit(1);
        }
    },

    askPreferences: async function() {
        await ask('boilerplate');
        await ask('targetPlatform');
        await ask('packageManager');
    },

    cloneBoilerplate: async function() {
        clear();
        const url = boilerplateURLs[prefer.boilerplate];
        const branch = prefer.targetPlatform === 'Electron' ? 'electron' : 'master';
        appSpinner = ora('Creating application').start();
        return new Promise((resolve) => {
            exec(`git clone -b ${branch} --single-branch ${url} ${appName}`, (errorMsg) => {
                if (errorMsg) {
                    appSpinner.fail();
                    error(chalk.red(errorMsg));
                    return;
                }
                appSpinner.succeed();
                resolve();
            });
        })
    },

    installDependencies: async function() {
        if (prefer.packageManager === 'Skip this step') {
            ora('Dependencies not installed').warn();
            ora('Application created successfully !!').succeed();
            display(`$ cd ${appName}|Install dependencies|$ frappe start ${execMode()}`);
        } else {
            const installCommand = prefer.packageManager === 'NPM' ? 'npm i' : 'yarn';
            await startDepInstall(installCommand);
        }
    }
}