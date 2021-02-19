const { writeBufferToFile, readBufferFromFile, hexBufferToNumber, numberToHexBuffer } = require('../shared/utils')
const { readHeaderFromVDisk } = require('../shared/vdisk')
const HardDiskHeader = require('../structure/header')

/**
 * 写入 VHD-Fixed 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 */
function writeFixed(vhdFile, data, sector) {
    const offset = sector * 512
    // todo: 这里需要检查是否会覆盖掉最后的footer扇区
    return writeBufferToFile(vhdFile, data, offset)
}

/**
 * 写入 VHD-Dynamic 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 */
function writeDynamic(vhdFile, data, sector) {
    // 1. 读取并解析 header 结构
    const headerBuffer = readHeaderFromVDisk(vhdFile)
    const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

    // 2. 计算要写入的数据占用多少个block
    const blockSize = hdHeaderJson.blockSize
    // const blockCount = Math.ceil(data.length / blockSize)

    // BAT占用的扇区数
    const batSectors = Math.ceil(hdHeaderJson.maxTableEntries * 4 / 512)
    const blockOffset = hdHeaderJson.tableOffset + 512 * batSectors


    // 分配一个新的block
    const block = allocBlock(blockSize)

    // 暂时没有更好的办法更新bitmap，所以索性把它全置1
    for (let i = 0; i < 512; i++) {
        block[i] = 0xFF
    }
    // 将数据写入该block
    for (let i = 0; i < data.length; i++) {
        // 跳过bitmap扇区
        block[512+i] = data[i]
    }

    // 将该block插入磁盘文件
    writeBufferToFile(vhdFile, block, blockOffset, true)

    // 更新BAT
    const tableEntry = numberToHexBuffer(blockOffset/512, 4)
    writeBufferToFile(vhdFile, tableEntry, hdHeaderJson.tableOffset, false)

    // 更新bitmap扇区
    // numberToHexBuffer(8)
}

function allocBlock(blockSize) {
    // bitmap扇区
    return Buffer.alloc(blockSize+512, 0)
}

/**
 * 写入 VHD-Differencing 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 */
function writeDifferencing(vhdFile, data, sector) {
    console.log('暂未实现')
}

module.exports = {
    writeVhdFixed: writeFixed,
    writeVhdDynamic: writeDynamic,
    writeVhdDifferencing: writeDifferencing,
}
