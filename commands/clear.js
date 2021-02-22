const { VDISK_TYPE } = require('../const')
const { resolveVDiskType } = require('../shared/vdisk')
const { clearVhdFixed, clearVhdDynamic, clearVhdDifferencing } = require('./clear-vhd')
const { debug } = require('../shared/log')

function clear(vhdFile) {
    const vdiskType = resolveVDiskType(vhdFile)

    switch (vdiskType) {
        case VDISK_TYPE.VHD_FIXED:
            clearVhdFixed(vhdFile)
            break
        case VDISK_TYPE.VHD_DYNAMIC:
            clearVhdDynamic(vhdFile)
            break
        case VDISK_TYPE.VHD_DIFFERENCING:
            clearVhdDifferencing(vhdFile)
            break
        case VDISK_TYPE.UNKNOWN:
            throw new Error('unknown vdisk type')
        default:
            debug('该类型还未实现')
            break
    }
}

module.exports = {
    clearCommand: clear
}
