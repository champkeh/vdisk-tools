const fs = require('fs')
const { writeBufferToFile } = require('../shared/utils')

/**
 * 清除 VHD-Fixed 类型的文件
 * @param vhdFile
 */
function clearFixed(vhdFile) {
    const buffer = Buffer.alloc(fs.statSync(vhdFile).size - 512, 0)
    return writeBufferToFile(vhdFile, buffer, 0)
}

/**
 * 清除 VHD-Dynamic 类型的文件
 * @param vhdFile
 */
function clearDynamic(vhdFile) {
    // 找到动态磁盘文件的写入位置
    console.log('暂未实现')
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
