const {readFooterFromVDisk, resolveVDiskType} = require('../shared/vdisk')
const { readBufferFromFile } = require('../shared/utils')
const HardDiskFooter = require('../structure/vhd/footer')
const HardDiskHeader = require('../structure/vhd/header')
const { VDISK_TYPE } = require('../const')
const chalk = require('chalk')

function inspect(vhdFilePath) {
    const vdiskType = resolveVDiskType(vhdFilePath)

    // 读取并解析 footer 结构
    const footerBuffer = readFooterFromVDisk(vhdFilePath)
    const hdFooterJson = new HardDiskFooter(footerBuffer).toJSON()

    if (vdiskType === VDISK_TYPE.VHD_FIXED) {
        console.log(`Format: ${chalk.magenta('Fixed hard disk')}`)
        console.log(chalk.gray('Hard disk footer:'))
        console.log(hdFooterJson)
    } else if (vdiskType === VDISK_TYPE.VHD_DYNAMIC) {
        console.log(`Format: ${chalk.magenta('Dynamic hard disk')}`)
        console.log(chalk.gray('Hard disk footer:'))
        console.log(hdFooterJson)

        // 读取并解析 header 结构
        const headerBuffer = readBufferFromFile(vhdFilePath, 512, 1024)
        const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

        console.log(chalk.gray('Hard disk header:'))
        console.log(hdHeaderJson)
    }
}

module.exports = {
    inspectCommand: inspect
}
