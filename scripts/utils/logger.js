const ms = require('ms');
const chalk = require('chalk');
const cfonts = require('cfonts');
const readline = require('readline');
const cliProgress = require('cli-progress');

const progressBar = new cliProgress.Bar({
    format: chalk.green(' {bar}') + ' {percentage}%',
    align: 'center',
    stopOnComplete: true,
    barsize: 60
}, cliProgress.Presets.shades_classic);

let prevTime;

function clearConsole() {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
}

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
        clearConsole();
        showHeader();
    },

    display: function(instruction) {
        cfonts.say(instruction, {
            font: 'console',
            align: 'center',
            colors: ['cyanBright'],
            lineHeight: 1
        });
    },

    progress: function(percentage) {
        progressBar.update(Math.ceil(percentage*100));
    },

    progressBar
}