const ms = require('ms');
const chalk = require('chalk');
const cfonts = require('cfonts');
const cliClear = require("cli-clear");

let prevTime;

function showHeader() {
    cfonts.say('FrappeJS', {
        font: 'simple',
        align: 'center',
        colors: ['cyanBright']
    });
}

module.exports = {
    logger: function(banner, color = 'green') {
        return function(message) {
            const currentTime = +new Date();
            const diff = currentTime - (prevTime || currentTime);
            prevTime = currentTime;

            if (message) {
                console.log(` ${chalk[color](banner)} ${message} ${chalk.green(`+${ms(diff)}`)}`)
            } else {
                console.log()
            }
        }
    },
	  
    clear: function() {
        cliClear();
        showHeader();
    },

    instruct: function(instruction) {
        cfonts.say(instruction, {
            font: 'console',
            align: 'center',
            colors: ['cyanBright'],
            lineHeight: 1
        });
    }
}