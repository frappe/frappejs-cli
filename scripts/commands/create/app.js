const { exec } = require('child_process');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { resolveAppDir } = require('../../utils/utils');
const details = require('./prompts/setupDetails');
const { logger, clear, instruct } = require('../../utils/logger');
const error = logger('\n\nerror', 'red');

let appName = undefined, appSpinner, depSpinner;

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

async function startDepInstall(installCommand) {
    depSpinner = ora('Installing dependencies').start();
    return new Promise((resolve) => {
        exec(installCommand, { cwd: resolveAppDir(`./${appName}`) }, (error, stdout, stderr) => {
            if (error) {
                depSpinner.fail();
                error(chalk.red(error));
                return;
            }
            depSpinner.succeed();
            ora('Setup complete').succeed();
            instruct(`$ cd ${appName}|$ frappe start`);
            resolve();
        });
    });
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
        await ask('packageManager');
    },

    cloneBoilerplate: async function() {
        clear();
        const url = boilerplateURLs[prefer.boilerplate];
        appSpinner = ora('Creating the application').start();
        return new Promise((resolve) => {
            exec(`git clone ${url} ${appName}`, (error, stdout, stderr) => {
                if (error) {
                    appSpinner.fail();
                    error(chalk.red(error));
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
            ora('Setup complete').succeed();
            instruct(`$ cd ${appName}|Install dependencies|$ frappe start`);
        } else {
            const installCommand = prefer.packageManager === 'NPM' ? 'npm i' : 'yarn';
            await startDepInstall(installCommand);
        }
    }
}