#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const { write } = require('./commands/write')

program
    .version(require('./package.json').version)


// subcommand: write <vhd> <bin>
program
    .command('write <vhd> <bin>')
    .description('write special binary file to virtual hard disk(vhd)', {
        vhd: 'virtual hard disk (.vhd format only)',
        bin: 'binary file'
    })
    .option('-s, --sector <sector>', 'sector number to write begin', 0)
    .option('-f, --force', 'force write', false)
    .action((vhd, bin, options, command) => {
        const sector = Number(options.sector)
        const force = options.force
        if (isNaN(sector)) {
            throw new Error('-s参数必须为整数')
        }
        console.log('写入模式:')
        console.log(`  扇区: ${sector}`)
        console.log(`  强制写入: ${force}`)
        write(vhd, bin, options.sector)
    })

program.parse(process.argv)
