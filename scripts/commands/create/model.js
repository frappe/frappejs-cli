const fs = require('fs');
const inquirer = require('inquirer');
const ask = require('./prompts/modelDetails');
const { resolveAppDir } = require('../../utils/utils');
const chalk = require('chalk');
const { logger } = require('../../utils/logger');
const log = logger('cli', 'yellow');

module.exports = {
    newModel: async function(name) {
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