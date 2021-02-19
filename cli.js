#!/usr/bin/env node

const { Command, InvalidOptionArgumentError } = require('commander')
const program = new Command()
const { inspectCommand } = require('./commands/inspect')
const { readCommand } = require('./commands/read')
const { writeCommand } = require('./commands/write')
const { clearCommand } = require('./commands/clear')

program
    .version('v'+require('./package.json').version, '-v, --version', 'output the current version')


// subcommand: inspect <vhd>
program
    .command('inspect <vhd>')
    .description('inspect virtual disk file structure', {
        vhd: 'virtual hard disk file'
    })
    .action((vhd) => {
        inspectCommand(vhd)
    })

// subcommand: read <vhd>
program
    .command('read <vhd>')
    .description('read sector data from virtual disk file', {
        vhd: 'virtual hard disk file'
    })
    .option('-s, --sector <sector>', 'sector number to read begin', optionParseInt, 0)
    .option('-c, --count <count>', 'sector count to read', optionParseInt, 1)
    .action((vhd, { sector, count }) => {
        // todo: 这里可以添加格式化器
        console.log(readCommand(vhd, sector, count))
    })

// subcommand: write <vhd> <bin>
program
    .command('write <vhd> <bin>')
    .description('write special binary file to virtual disk file', {
        vhd: 'virtual hard disk file',
        bin: 'binary file'
    })
    .option('-s, --sector <sector>', 'sector number to write begin', optionParseInt, 0)
    .action((vhd, bin, { sector }) => {
        writeCommand(vhd, bin, sector)
    })

// subcommand: clear <vhd>
program
    .command('clear <vhd>')
    .description('clear virtual disk file content', {
        vhd: 'virtual hard disk file'
    })
    .action((vhd) => {
        clearCommand(vhd)
    })

// subcommand: graph <vhd>
// program
//     .command('graph')
//     .description('generate graph about vhd structure')

program.parse(process.argv)


// option parser
function optionParseInt(value) {
    const parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue)) {
        throw new InvalidOptionArgumentError('Not a number.')
    }
    return parsedValue
}
