const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const details = require('./prompts/modelDetails');
const { resolveAppDir } = require('../../utils/utils');
const { clear, logger } = require('../../utils/logger');
const error = logger('\nError:\n', 'red');

let model = {};

async function askField() {
    clear();
    console.log(chalk.cyan('(Press enter to skip and move to next step)'));
    inquirer.prompt(details.fieldName).then(async answer => {
        if(answer.fieldname != '') {
            await askFieldDetails(answer.fieldname);
        } else {
            clear();
            await askKeywordFields(model.keywordFields);
        }
    });
}

async function askFieldDetails(fieldname) {
    inquirer.prompt(details.fieldDetails).then(async answers => {
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
        model.fields.push(fieldObj);
        await askField();
    });
}

async function askSelectOptions(options) {
    return inquirer.prompt(details.optionName).then(async answer => {
        if(answer.option != '') {
            options.push(answer.option);
            await askSelectOptions(options);
        } else {
            return;
        }
    });
}

async function askTarget(fieldObj) {
    return inquirer.prompt(details.targetName).then(answer => {
        return fieldObj.target = answer.target;
    });
}

async function askForDirectory(fieldObj) {
    return inquirer.prompt(details.isDirectory).then(answer => {
        fieldObj.directory = answer.directory;
        return;
    });
}

async function askKeywordFields(keywordFields) {
    return inquirer.prompt(details.keywordName).then(async answer => {
        if(answer.option != '') {
            keywordFields.push(answer.option);
            await askKeywordFields(keywordFields);
        } else {
            clear();
            fs.mkdirSync(resolveAppDir(`./models/doctype/${model.name}`));
            fs.writeFileSync(resolveAppDir(`./models/doctype/${model.name}/${model.name}.js`), 'module.exports = '+JSON.stringify(model, null, 4));
            ora('Model created successfully !!\n\n').succeed();
            return;
        }
    });
}

module.exports = {
    checkIfExists: async function(name) {
        model['name'] = name;
        if (fs.existsSync(`./models/doctype/${model.name}`)) {
            error(chalk.red(`Model with name ${name} already exists.`));
            process.exit(1);
        }
    },

    newModel: async function() {
        clear();
        inquirer.prompt(details.modelDetails).then(async answers => {
            model.label = answers.label;
            model.naming = answers.naming;
            model.isSingle = answers.isSingle;
            model.isChild = answers.isChild;
            model.keywordFields = [];
            model.fields = [];
            await askField();
        });
    }
}