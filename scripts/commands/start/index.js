const { spawn } = require('child_process');
const { startWebpackDevServer } = require('../../webpack/serve');
const { getAppConfig, resolveAppDir } = require('../../utils/utils');
const { clear, display, progressBar } = require('../../utils/logger');

function startElectron(electron, electronPaths) {
    startWebpackDevServer().then((devServer) => {
        const p = spawn(electron, [resolveAppDir(electronPaths.mainDev)], { stdio: 'inherit' })
        p.on('close', () => {
            devServer.close();
        });
    });
}

function showMessage(mode) {
    clear();
    display('Starting app in development mode..');
    mode === 'electron' ? progressBar.start(100,0) : null;
}

module.exports = async function start(mode) {
    const appConfig = getAppConfig();
    process.env.NODE_ENV = 'development';
    if (mode === 'electron') {
        process.env["ELECTRON"] = 'true';
        const electron = require('electron');
        const electronPaths = appConfig.electron.paths;
        showMessage(mode);
        startElectron(electron, electronPaths)
    } else {
        showMessage(mode);
        const nodePaths = appConfig.node.paths;
        spawn('node', [resolveAppDir(nodePaths.main)], { stdio: 'inherit' })
    }
}