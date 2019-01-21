const app = require('./create');
const model = require('./create/model');
const start = require('./start');
const build = require('./build');

module.exports = {
    newApp: async function(name, url) {
        await app.checkIfExists(name);
        if (url) {
            await app.cloneUrl(name, url);
        } else {
            await app.askPreferences();
            await app.cloneBoilerplate();
        }
        await app.installDependencies();
    },
    
    newModel: async function(name) {
        await model.checkIfExists(name);
        model.newModel(name);
    },

    startApp: function(mode) {
        start(mode);
    },
    
    buildApp: function(mode) {
        build(mode);
    }
}
