#!/usr/bin/env node

const { program } = require('commander');
program.version(require('./package.json').version);

program
    .requiredOption('-v, --vhd <vdh file>', '.vhd file to modify')
    .option('-b, --boot <bin file>', '.bin file to write')
    .option('-a, --asm <asm file>', 'asm file')


program.parse(process.argv)


const options = program.opts()
if (!options.boot && !options.asm) {
    console.warn('-b 和 -a 参数不能同时为空')
    process.exit(1)
}

const targetFile = options.vhd
const dataFile = options.boot


const { writeBinDataToVhdFile } = require('./utils')
writeBinDataToVhdFile(targetFile, dataFile)
