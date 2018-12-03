module.exports = {
    boilerplate: {
        type: 'list',
        name: 'boilerplate',
        message: 'Select a boilerplate for your app: ',
        choices: [
            'Blank Frontend',
            'VueJS Frontend',
            'Only Server'
        ]
    },

    packageManager: {
        type: 'list',
        name: 'packageManager',
        message: 'Select a node package manager for your app: ',
        choices: [
            'NPM',
            'Yarn',
            'Skip this step'
        ]
    }
}