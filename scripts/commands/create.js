const inquirer = require('inquirer');
const fs = require('fs');
const ask = require('./prompt');
const { spawn } = require('child_process');
const chalk = require('chalk');
const logger = require('../utils/logger');
const log = logger('boilerplate', 'yellow');
const { resolveAppDir } = require('../utils/utils');

module.exports = {
    newApp: function(name) {
        log(`${chalk.blue('Creating new FrappeJS application.....')}`);
        clone = spawn('git', ['clone', 'https://github.com/anto-christo/frappejs-boilerplate', name]);
        clone.stdout.on('data', function (data) {
        });
        clone.stderr.on('data', function (data) {
        });
        clone.on('exit', function (code) {
            if(code) {
                log(`${chalk.red('The process stopped unexpectedly with error code: '+code)}`);
            } else {
                packageJSON = require(resolveAppDir(`./${name}/package.json`));
                console.log('Enter application details:');
                inquirer.prompt(ask.appDetails).then(async answers => {
                    packageJSON.name = name;
                    packageJSON.version = answers.version;
                    packageJSON.description = answers.description;
                    packageJSON.author = answers.author;
                    packageJSON.repository = answers.repository;
                    packageJSON.license = answers.license;
                    fs.writeFileSync(resolveAppDir(`./${name}/package.json`), JSON.stringify(packageJSON));
                    log(`${chalk.green('Application created successfully !!')}`);
                    log(`${chalk.blue('Installing dependencies, this may take a while.....')}`);
                    yarn = spawn('yarn', [],{ cwd: resolveAppDir(`./${name}/`) });
                    yarn.stdout.on('data', function (data) {
                        data = data.toString();
                        if(data.startsWith('[')) {
                            console.log(data.toString());
                        }                    
                    });
                    yarn.stderr.on('data', function (data) {
                        data = data.toString();
                        if(data.startsWith('[')) {
                            console.log(data.toString());
                        }                   
                    });
                    yarn.on('exit', function (code) {
                        if(code) {
                            log(`${chalk.red('The process stopped unexpectedly with error code: '+code)}`);
                        } else {
                            log(`${chalk.green('Dependencies installed successfully')}`);
                            log(`${chalk.blue('Run ')+ chalk.yellow('frappe start ')+ chalk.blue('at the root of new project to start the application in development server')}`);
                        }
                    });
                });
            }
        });
    },
    
    newModel: function(name) {
        var obj = {};
        obj['name'] = name;
        inquirer.prompt(ask.modelDetails).then(async answers => {
            obj.label = answers.label;
            obj.naming = answers.naming;
            obj.isSingle = answers.isSingle;
            obj.isChild = answers.isChild;
            obj.keywordFields = [];
            obj.fields = [];
            await askField();
        });

        async function askField() {
            inquirer.prompt(ask.fieldName).then(async answer => {
                if(answer.fieldname != '') {
                    await askFieldDetails(answer.fieldname);
                } else {
                    await askKeywordFields(obj.keywordFields);
                }
            });
        }

        async function askFieldDetails(fieldname) {
            inquirer.prompt(ask.fieldDetails).then(async answers => {
                fieldObj = {};
                fieldObj.fieldname = fieldname;
                fieldObj.label = answers.label;
                fieldObj.fieldtype = answers.fieldtype;
                fieldObj.disabled = answers.disabled;
                fieldObj.required = answers.required;
                if(answers.fieldtype == 'Select') {
                    fieldObj.options = [];
                    await askSelectOptions(fieldObj.options);
                } else if (answers.fieldtype == 'Link') {
                    await askTarget(fieldObj);
                } else if (answers.fieldtype == 'File') {
                    await askForDirectory(fieldObj);
                }
                obj.fields.push(fieldObj);
                await askField();
            });
        }

        async function askSelectOptions(options) {
            return inquirer.prompt(ask.optionName).then(async answer => {
                if(answer.option != '') {
                    options.push(answer.option);
                    await askSelectOptions(options);
                } else {
                    return;
                }
            });
        }

        async function askTarget(fieldObj) {
            return inquirer.prompt(ask.targetName).then(answer => {
                return fieldObj.target = answer.target;
            });
        }

        async function askForDirectory(fieldObj) {
            return inquirer.prompt(ask.isDirectory).then(answer => {
                fieldObj.directory = answer.directory;
                return;
            });
        }

        async function askKeywordFields(keywordFields) {
            return inquirer.prompt(ask.keywordName).then(async answer => {
                if(answer.option != '') {
                    keywordFields.push(answer.option);
                    await askKeywordFields(keywordFields);
                } else {
                    fs.mkdirSync(resolveAppDir(`./models/doctype/${name}`));
                    fs.writeFileSync(resolveAppDir(`./models/doctype/${name}/${name}.js`), 'module.exports = '+JSON.stringify(obj));
                    log(`${chalk.green('Model created successfully !!')}`);
                    return;
                }
            });
        }
    }
}
