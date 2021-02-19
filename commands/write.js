const { VDISK_TYPE } = require('../const')
const { resolveVDiskType } = require('../shared/vdisk')
const { readBufferToEnd } = require('../shared/utils')
const { writeVhdFixed, writeVhdDynamic, writeVhdDifferencing } = require('./write-vhd')

function write(vhdFile, binFile, sector, force) {
    const vdiskType = resolveVDiskType(vhdFile)
    const data = readBufferToEnd(binFile, 0)

    switch (vdiskType) {
        case VDISK_TYPE.VHD_FIXED:
            writeVhdFixed(vhdFile, data, sector, force)
            break
        case VDISK_TYPE.VHD_DYNAMIC:
            writeVhdDynamic(vhdFile, data, sector, force)
            break
        case VDISK_TYPE.VHD_DIFFERENCING:
            writeVhdDifferencing(vhdFile, data, sector, force)
            break
        case VDISK_TYPE.UNKNOWN:
            throw new Error('unknown vdisk type')
        default:
            console.log('该类型还未实现')
            break
    }
}

module.exports = {
    writeCommand: write
}
