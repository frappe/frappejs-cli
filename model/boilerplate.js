const inquirer = require('inquirer');
const fs = require('fs');
const details = require('./modelDetails');
const { exec } = require('child_process');

module.exports = {
    createNewApp: function(name) {
        exec(`git clone https://github.com/anto-christo/frappejs-boilerplate ${name}`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        });
    },
    
    createNewModel: function(name) {
        var obj = {};
        obj['name'] = name;
        inquirer.prompt(details.modelDetails).then(async answers => {
            obj.label = answers.label;
            obj.naming = answers.naming;
            obj.isSingle = answers.isSingle;
            obj.isChild = answers.isChild;
            obj.keywordFields = [];
            obj.fields = [];
            await askKeywordFields(obj.keywordFields);
            askField();
        });

        async function askKeywordFields(keywordFields) {
            return inquirer.prompt(details.keywordName).then(async answer => {
                if(answer.option != '') {
                    keywordFields.push(answer.option);
                    await askKeywordFields(keywordFields);
                } else {
                    return;
                }
            });
        }

        function askField() {
            inquirer.prompt(details.fieldName).then(answer => {
                if(answer.fieldname != '') {
                    askFieldDetails(answer.fieldname);
                } else {
                    fs.mkdirSync(`./models/doctype/${name}`);
                    fs.writeFileSync(`./models/doctype/${name}/${name}.js`, 'module.exports = '+JSON.stringify(obj));
                }
            });
        }

        function askFieldDetails(fieldname) {
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
                obj.fields.push(fieldObj);
                askField();
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
    }
}
