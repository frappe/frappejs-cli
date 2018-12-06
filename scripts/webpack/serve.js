const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const { logger } = require('../utils/logger');
const { getAppConfig } = require('../utils/utils');

function startWebpackDevServer() {
    return new Promise(resolve => {
        const { getConfig: getWebpackConfig } = require('./config');
        const appConfig = getAppConfig();
        const webpackConfig = getWebpackConfig();
        addWebpackEntryPoints(webpackConfig, true);
        const compiler = webpack(webpackConfig);
        const server = new webpackDevServer(compiler, webpackConfig.devServer);

        const { devServerHost, devServerPort } = appConfig.dev;
        server.listen(devServerPort, devServerHost, () => {
            // listening on devServerPort
            compiler.hooks.done.tap('webpack done compiling', function() {
                resolve(server);
            });
        });
    })
}

function addWebpackEntryPoints(webpackConfig, forDevServer) {
    const devServerEntryPoints = [
        'webpack-dev-server/client/index.js?http://localhost',
        'webpack/hot/dev-server'
    ];
    const middlewareEntryPoints = [
        'webpack-hot-middleware/client?path=/__webpack_hmr'
    ];
    const entryPoints = forDevServer ? devServerEntryPoints : middlewareEntryPoints;
    const entry = webpackConfig.entry;

    Object.keys(entry).forEach(key => {
        entry[key] = [...entryPoints, entry[key]];
    });
}

module.exports = {
    startWebpackDevServer
}