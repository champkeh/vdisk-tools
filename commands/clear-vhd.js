const fs = require('fs')
const { writeBufferToFile } = require('../shared/utils')
const { readHeaderFromVDisk, readFooterFromVDisk } = require('../shared/vdisk')
const HardDiskHeader = require('../structure/header')

/**
 * 清除 VHD-Fixed 类型的文件
 * @param vhdFile
 */
function clearFixed(vhdFile) {
    const zeroData = Buffer.alloc(fs.statSync(vhdFile).size - 512, 0)
    return writeBufferToFile(vhdFile, zeroData, 0)
}

/**
 * 清除 VHD-Dynamic 类型的文件
 * @param vhdFile
 */
function clearDynamic(vhdFile) {
    // 1. 读取并解析 header 结构
    const headerBuffer = readHeaderFromVDisk(vhdFile)
    const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

    // 2. 重置BAT
    const batSectors = Math.ceil(hdHeaderJson.maxTableEntries * 4 / 512)
    const zeroBAT = Buffer.alloc(batSectors*512, 0)
    for (let i = 0; i < hdHeaderJson.maxTableEntries*4;) {
        zeroBAT[i++] = 0xFF
        zeroBAT[i++] = 0xFF
        zeroBAT[i++] = 0xFF
        zeroBAT[i++] = 0xFF
    }
    writeBufferToFile(vhdFile, zeroBAT, hdHeaderJson.tableOffset, false)

    // 3. 将footer写入第一个block处
    const footerBuffer = readFooterFromVDisk(vhdFile)
    const blockOffset = hdHeaderJson.tableOffset + 512 * batSectors
    writeBufferToFile(vhdFile, footerBuffer, blockOffset, false)

    // 4. 截断后面的内容
    const fileLen = 512*2 + 1024 + batSectors*512
    fs.truncateSync(vhdFile, fileLen)
}

/**
 * 清除 VHD-Differencing 类型的文件
 * @param vhdFile
 */
function clearDifferencing(vhdFile) {
    console.log('暂未实现')
}

module.exports = {
    clearVhdFixed: clearFixed,
    clearVhdDynamic: clearDynamic,
    clearVhdDifferencing: clearDifferencing,
}
