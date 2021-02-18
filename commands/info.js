const {readFooterFromVDisk, readHeaderFromVDisk} = require('../utils')
const HardDiskFooter = require('../structure/footer')
const HardDiskHeader = require('../structure/header')

function info(vhdFilePath) {
    // 先读取 footer
    const footerBuffer = readFooterFromVDisk(vhdFilePath)
    const hdFooterJson = new HardDiskFooter(footerBuffer).toJSON()

    if (hdFooterJson.diskType === 'Fixed hard disk') {
        console.log('Format: Fixed hard disk')
        console.log('Hard disk footer:')
        console.log(hdFooterJson)
    } else if (hdFooterJson.diskType === 'Dynamic hard disk') {
        console.log('Format: Dynamic hard disk')
        console.log('Hard disk footer:')
        console.log(hdFooterJson)

        // 读取 header
        const headerBuffer = readHeaderFromVDisk(vhdFilePath)
        const hdHeaderJson = new HardDiskHeader(headerBuffer).toJSON()

        console.log('Hard disk header:')
        console.log(hdHeaderJson)
    }
}

module.exports = {
    info
}
