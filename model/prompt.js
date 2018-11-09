module.exports = {
    appDetails: [
        {
            type: 'input',
            name: 'version',
            message: 'Version',
            default: '1.0.0'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description',
            default: ''
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author',
            default: ''
        },
        {
            type: 'input',
            name: 'repository',
            message: 'Repository',
            default: ''
        },
        {
            type: 'input',
            name: 'license',
            message: 'License',
            default: 'MIT'
        }
    ],

    modelDetails: [
        {
            type: 'input',
            name: 'label',
            message: 'Enter label name: ',
        },
        {
            type: 'list',
            name: 'naming',
            message: 'Choose naming type: ',
            choices: [
                'random',
                'autoincrement'
            ],
            default: 'random'
        },
        {
          type: 'confirm',
          name: 'isSingle',
          message: 'Is this a single doctype? ',
          default: false
        },
        {
            type: 'confirm',
            name: 'isChild',
            message: 'Is this a child doctype? ',
            default: false
        }
    ],

    fieldDetails: [
        {
            type: 'input',
            name: 'label',
            message: 'Enter field label: '
        },
        
        {
            type: 'confirm',
            name: 'disabled',
            message: 'Is this a disabled field? ',
            default: false
        },
        {
            type: 'confirm',
            name: 'required',
            message: 'Is this a compulsory field? ',
            default: false
        },
        {
            type: 'list',
            name: 'fieldtype',
            message: 'Choose field type: ',
            choices: [
                'Autocomplete',
                'Currency',
                'Data',
                'Date',
                'File',
                'Float',
                'Int',
                'Link',
                'Password',
                'Select',
                'Table',
                'Text',
                'Time'
            ],
            pageSize: 12,
            default: 'Data'
        }
    ],

    keywordName: {
        type: 'input',
        name: 'option',
        message: 'Enter a keyword field: ',
        default: ''
    },

    fieldName: {
        type: 'input',
        name: 'fieldname',
        message: 'Enter field name: ',
        default: ''
    },

    optionName: {
        type: 'input',
        name: 'option',
        message: 'Enter an option: ',
        default: ''
    },

    targetName: {
        type: 'input',
        name: 'target',
        message: 'Enter name of target doctype: '
    },

    isDirectory: {
        type: 'confirm',
        name: 'directory',
        message: 'Do you want to enable directory selection? ',
        default: false
    }
}