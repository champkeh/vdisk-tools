const { readBufferFromFile } = require('../shared/utils')

/**
 * 读取 VHD-Fixed 类型的文件
 * @param vhdFile
 * @param sector
 * @param count
 */
function readFixed(vhdFile, sector, count) {
    const offset = sector * 512
    const length = count * 512
    return readBufferFromFile(vhdFile, offset, length)
}

/**
 * 读取 VHD-Dynamic 类型的文件
 * @param vhdFile
 * @param sector
 * @param count
 */
function readDynamic(vhdFile, sector, count) {
    console.log('暂未实现')
}

/**
 * 读取 VHD-Differencing 类型的文件
 * @param vhdFile
 * @param sector
 * @param count
 */
function readDifferencing(vhdFile, sector, count) {
    console.log('暂未实现')
}

module.exports = {
    readVhdFixed: readFixed,
    readVhdDynamic: readDynamic,
    readVhdDifferencing: readDifferencing,
}
