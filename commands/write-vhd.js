const { writeBufferToFile } = require('../shared/utils')

/**
 * 写入 VHD-Fixed 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 * @param force
 */
function writeFixed(vhdFile, data, sector, force) {
    const offset = sector * 512
    return writeBufferToFile(vhdFile, data, offset)
}

/**
 * 写入 VHD-Dynamic 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 * @param force
 */
function writeDynamic(vhdFile, data, sector, force) {
    // 找到动态磁盘文件的写入位置
    console.log('暂未实现')
}

/**
 * 写入 VHD-Differencing 类型的文件
 * @param vhdFile
 * @param data
 * @param sector
 * @param force
 */
function writeDifferencing(vhdFile, data, sector, force) {
    console.log('暂未实现')
}

module.exports = {
    writeVhdFixed: writeFixed,
    writeVhdDynamic: writeDynamic,
    writeVhdDifferencing: writeDifferencing,
}
