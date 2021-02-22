const { VDISK_TYPE } = require('../const')
const { resolveVDiskType } = require('../shared/vdisk')
const { readBufferFromFileToEnd } = require('../shared/utils')
const { writeVhdFixed, writeVhdDynamic, writeVhdDifferencing } = require('./write-vhd')
const { debug } = require('../shared/log')

function write(vhdFile, binFile, sector) {
    const vdiskType = resolveVDiskType(vhdFile)
    const data = readBufferFromFileToEnd(binFile, 0)

    switch (vdiskType) {
        case VDISK_TYPE.VHD_FIXED:
            writeVhdFixed(vhdFile, data, sector)
            break
        case VDISK_TYPE.VHD_DYNAMIC:
            writeVhdDynamic(vhdFile, data, sector)
            break
        case VDISK_TYPE.VHD_DIFFERENCING:
            writeVhdDifferencing(vhdFile, data, sector)
            break
        case VDISK_TYPE.UNKNOWN:
            throw new Error('unknown vdisk type')
        default:
            debug('该类型还未实现')
            break
    }
}

module.exports = {
    writeCommand: write
}
