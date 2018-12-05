const { spawn } = require('child_process');
const { startWebpackDevServer } = require('../../webpack/serve');
const { getAppConfig, resolveAppDir } = require('../../utils/utils');

function startElectron(electron, electronPaths) {
    startWebpackDevServer().then((devServer) => {
        const p = spawn(electron, [resolveAppDir(electronPaths.mainDev)], { stdio: 'inherit' })
        p.on('close', () => {
            devServer.close();
        });
    });
}

module.exports = async function start(mode) {
    const appConfig = getAppConfig();
    process.env.NODE_ENV = 'development';
    if (mode === 'electron') {
        process.env["ELECTRON"] = 'true';
        const electron = require('electron');
        const electronPaths = appConfig.electron.paths;
        startElectron(electron, electronPaths)
    } else {
        const nodePaths = appConfig.node.paths;
        spawn('node', [resolveAppDir(nodePaths.main)], { stdio: 'inherit' })
    }
}