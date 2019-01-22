const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const deepmerge = require('deepmerge');
const { logger } = require('./logger');

const frappeConf = 'frappe.conf.js';

function isValidDir() {
  if (fs.existsSync(path.join(getAppDir(), frappeConf)) && fs.existsSync(path.join(getAppDir(), 'package.json'))) {
    return true;
  }
  warn = logger('utils', 'red')
  warn();
  warn(`Looks like this is not the root of a FrappeJS project`);
  warn(`Please run this command from a folder which contains ${chalk.yellow(frappeConf)} and ${chalk.yellow('package.json')} file`);
  warn();
  process.exit(1);
}

function getAppDir() {
  return process.cwd();
}

function getAppConfig() {
  const defaults = {
    dev: {
      devServerHost: 'localhost',
      devServerPort: 8000
    }
  }
  const appConfig = require(path.resolve(getAppDir(), frappeConf));
  return deepmerge(defaults, appConfig);
}

function resolveAppDir(...args) {
  return path.resolve(getAppDir(), ...args);
}

function slugify(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

module.exports = {
  isValidDir,
  getAppDir,
  getAppConfig,
  resolveAppDir,
  slugify
}