module.exports = {
    boilerplate: {
        type: 'list',
        name: 'boilerplate',
        message: 'Select a boilerplate for your app: ',
        choices: [
            'Blank',
            'VueJS',
            'Server'
        ]
    },

    targetPlatform: {
        type: 'list',
        name: 'targetPlatform',
        message: 'Select a target platform for your app: ',
        choices: [
            'Web',
            'Electron'
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