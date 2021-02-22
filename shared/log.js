const chalk = require('chalk')

function debug(msg) {
    console.log(chalk.blackBright(`DEBUG: ${msg}`))
}

function info(msg) {
    console.log(msg)
}

function warn(msg) {
    console.log(chalk.yellow(`WARN: ${msg}`))
}

function error(msg) {
    console.log(chalk.red(`ERROR: ${msg}`))
}


module.exports = {
    debug,
    info,
    warn,
    error,
}
