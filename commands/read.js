const { resolveVDiskType } = require('../shared/vdisk')
const { VDISK_TYPE } = require('../const')
const { readVhdFixed, readVhdDynamic, readVhdDifferencing } = require('./read-vhd')
const { debug } = require('../shared/log')

/**
 * 从虚拟磁盘文件读取扇区内容
 * @param vhdFile 虚拟磁盘文件
 * @param sector 起始扇区号(编号从0开始)
 * @param count 扇区数
 */
function read(vhdFile, sector, count) {
    const vdiskType = resolveVDiskType(vhdFile)

    let content = null
    switch (vdiskType) {
        case VDISK_TYPE.VHD_FIXED:
            content = readVhdFixed(vhdFile, sector, count)
            break
        case VDISK_TYPE.VHD_DYNAMIC:
            content = readVhdDynamic(vhdFile, sector, count)
            break
        case VDISK_TYPE.VHD_DIFFERENCING:
            content = readVhdDifferencing(vhdFile, sector, count)
            break
        case VDISK_TYPE.UNKNOWN:
            throw new Error('unknown vdisk type')
        default:
            debug('该类型还未实现')
            break
    }
    return content
}

module.exports = {
    readCommand: read
}
