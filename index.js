#!/usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

program
    .requiredOption('-v, --vhd <vdh file>', '.vhd file to modify')
    .requiredOption('-b, --boot <bin file>', '.bin file to write')


program.parse(process.argv)

const options = program.opts()
const targetFile = options.vhd
const dataFile = options.boot

const fs = require('fs')

// 读取原始目标文件
const target = fs.readFileSync(targetFile)

// 将要写入的文件写入
const data = fs.readFileSync(dataFile)
// 验证要写入的内容是否大于466字节
if (data.length > 466) {
    console.error('写入引导扇区(MBR)的内容不得超过466字节')
    process.exit(1)
}
for (let i = 0; i < data.length; i++) {
    target[i] = data[i]
}
// 写入校验位
target[510] = 0x55
target[511] = 0xAA

// 覆盖掉原始文件
fs.writeFileSync(targetFile, target)
console.log('写入成功')

