const {
    readBufferFromFile,
    readBufferFromFileToEnd,
    writeBufferToFile,
    numberToBuffer,
    allocBuffer,
    ctorBAT,
} = require('../shared/utils')
const HardDiskHeader = require('../structure/vhd/header')
const HardDiskFooter = require('../structure/vhd/footer')
const { error, debug } = require('../shared/log')

/**
 * 写入 VHD-Fixed 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 */
function writeFixed(vhdFile, data, sector) {
    // 1. 读取并解析 header 结构
    const footerBuffer = readBufferFromFileToEnd(vhdFile, -512)
    const hdFooterJson = new HardDiskFooter(footerBuffer).toJSON()

    const maxSectors = hdFooterJson.originSize / 512
    const dataSectors = Math.ceil(data.length / 512) // 用户数据需要多少个扇区存储

    if (sector + dataSectors > maxSectors) {
        error('写入位置不合法，写入数据已超出磁盘最大容量')
        return
    }

    return writeBufferToFile(vhdFile, data, sector * 512, false)
}

/**
 * 写入 VHD-Dynamic 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 * @description todo(优化): 动态维护bitmap扇区
 */
function writeDynamic(vhdFile, data, sector) {
    // 1. 读取并解析 header 结构
    const headerBuffer = readBufferFromFile(vhdFile, 512, 1024)
    const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

    // 2. 计算block相关数据
    const blockSize = hdHeaderJson.blockSize
    const sectorsPerBlock = blockSize / 512
    const dataSectors = Math.ceil(data.length / 512) // 用户数据需要多少个扇区存储

    // 3. BAT相关数据
    const sectorsInBAT = Math.ceil(hdHeaderJson.maxTableEntries * 4 / 512)
    const batBufferData = readBufferFromFile(vhdFile, hdHeaderJson.tableOffset, sectorsInBAT*512)
    const bat = ctorBAT(batBufferData)

    const blockNumber = Math.floor(sector / sectorsPerBlock)
    const sectorInBlock = sector % sectorsPerBlock

    // 4. 检查是否会超出容量
    if (sector + dataSectors > hdHeaderJson.maxTableEntries * sectorsPerBlock) {
        error('写入位置不合法，写入数据已超出磁盘最大容量')
        return
    }

    // 5. 分配block
    // 初始写入位置所在的block还不存在，需要分配新的block
    if (blockNumber > bat.length - 1) {
        const allocBlockCount = blockNumber - (bat.length - 1) // 计算需要分配多少个block才能达到写入的初始位置
        for (let i = 0; i < allocBlockCount; i++) {
            const block = initBlock(blockSize)

            // 计算该block的偏移位置
            let blockOffset
            if (bat.length === 0) {
                blockOffset = hdHeaderJson.tableOffset + 512 * sectorsInBAT // 第一个block的偏移
            } else {
                blockOffset = bat[bat.length-1] * 512 + (blockSize + 512)
            }

            writeBufferToFile(vhdFile, block, blockOffset, true)
            const tableEntry = numberToBuffer(blockOffset/512, 4)   // bat中存放对应区块的偏移地址(以扇区单位)
            bat.push(blockOffset/512)

            // 更新BAT
            writeBufferToFile(vhdFile, tableEntry, hdHeaderJson.tableOffset + (bat.length-1)*4, false)
        }
    }

    // 初始位置的block已经存在
    let writeOffset = (bat[blockNumber] + 1 + sectorInBlock) * 512

    // 将数据写入该block(这里直接写死成第一个扇区)
    let writeData = []
    for (let i = 0; i < data.length; i++) {
        // 判断是否到达block边界
        const div = (writeOffset + i - (512 + 1024 + sectorsInBAT * 512)) % (blockSize+512)
        if (div === 0) {
            // 先将缓存里面的数据写入磁盘文件
            writeBufferToFile(vhdFile, Buffer.from(writeData), writeOffset, false)

            // 分配新的block
            const block = initBlock(blockSize)

            // 计算该block的偏移位置
            let blockOffset
            if (bat.length === 0) {
                blockOffset = hdHeaderJson.tableOffset + 512 * sectorsInBAT // 第一个block的偏移
            } else {
                blockOffset = bat[bat.length-1] * 512 + (blockSize + 512)
            }

            writeBufferToFile(vhdFile, block, blockOffset, true)
            const tableEntry = numberToBuffer(blockOffset/512, 4)   // bat中存放对应区块的偏移地址(以扇区单位)
            bat.push(blockOffset/512)

            // 更新BAT
            writeBufferToFile(vhdFile, tableEntry, hdHeaderJson.tableOffset + (bat.length-1)*4, false)

            // 更新容器
            writeData = []
            writeOffset = blockOffset+512
        }

        writeData.push(data[i])
    }

    // 将该block插入磁盘文件
    writeBufferToFile(vhdFile, Buffer.from(writeData), writeOffset, false)
}

function initBlock(blockSize) {
    const block = allocBuffer(blockSize+512)
    // 暂时没有更好的办法动态维护bitmap，所以索性把它全置1
    for (let i = 0; i < 512; i++) {
        block[i] = 0xFF
    }
    return block
}

/**
 * 写入 VHD-Differencing 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 */
function writeDifferencing(vhdFile, data, sector) {
    debug('暂未实现')
}

module.exports = {
    writeVhdFixed: writeFixed,
    writeVhdDynamic: writeDynamic,
    writeVhdDifferencing: writeDifferencing,
}
