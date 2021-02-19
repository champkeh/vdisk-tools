const {readFooterFromVDisk, readHeaderFromVDisk, resolveVDiskType} = require('../shared/vdisk')
const HardDiskFooter = require('../structure/footer')
const HardDiskHeader = require('../structure/header')
const { VDISK_TYPE } = require('../const')

function inspect(vhdFilePath) {
    const vdiskType = resolveVDiskType(vhdFilePath)

    // 读取并解析 footer 结构
    const footerBuffer = readFooterFromVDisk(vhdFilePath)
    const hdFooterJson = new HardDiskFooter(footerBuffer).toJSON()

    if (vdiskType === VDISK_TYPE.VHD_FIXED) {
        console.log('Format: Fixed hard disk')
        console.log('Hard disk footer:')
        console.log(hdFooterJson)
    } else if (vdiskType === VDISK_TYPE.VHD_DYNAMIC) {
        console.log('Format: Dynamic hard disk')
        console.log('Hard disk footer:')
        console.log(hdFooterJson)

        // 读取并解析 header 结构
        const headerBuffer = readHeaderFromVDisk(vhdFilePath)
        const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

        console.log('Hard disk header:')
        console.log(hdHeaderJson)
    }
}

module.exports = {
    inspectCommand: inspect
}
