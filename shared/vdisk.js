const fs = require('fs')
const { VDISK_TYPE } = require('../const')
const HardDiskFooter = require('../structure/footer')
const { readBufferToEnd, readBufferFromFile } = require('./utils')

/**
 * 解析虚拟磁盘文件的类型
 * @param vhdFile
 * @description 目前只支持 vhd 格式的文件
 */
function resolveVDiskType(vhdFile) {
    const footerBuffer = readFooterFromVDisk(vhdFile)
    const hdFooterJson = new HardDiskFooter(footerBuffer).toJSON()

    if (hdFooterJson.diskType === 'Fixed hard disk') {
        return VDISK_TYPE.VHD_FIXED
    } else if (hdFooterJson.diskType === 'Dynamic hard disk') {
        return VDISK_TYPE.VHD_DYNAMIC
    } else if (hdFooterJson.diskType === 'Differencing hard disk') {
        return VDISK_TYPE.VHD_DIFFERENCING
    } else {
        return VDISK_TYPE.UNKNOWN
    }
}

/**
 * 读取虚拟磁盘文件的Footer结构(最后512字节)
 * @param vhdFile
 */
function readFooterFromVDisk(vhdFile) {
    return readBufferToEnd(vhdFile, -512)
}

/**
 * 读取虚拟磁盘文件的Header结构(1024字节)
 * @param vhdFile
 */
function readHeaderFromVDisk(vhdFile) {
    return readBufferFromFile(vhdFile, 512, 1024)
}

function checkVhdValid(footer) {
    // console.log(footer)
    // todo(champ): 这里尝试解析 vhd footer 结构，如果失败则说明不是合法的 vhd 文件
    return true
}

/**
 * 将二进制文件binDataFile的内容写入vhd文件中
 * @param vhdFile {String} 虚拟硬盘文件路径
 * @param binDataFile {String} 二进制文件路径
 * @param sector {Number} 起始逻辑扇区数
 * @param force {Boolean} 是否强制写入启动扇区
 */
function writeBinDataToVhdFile(vhdFile, binDataFile, sector = 0, force = false) {
    // 读取原始 vhd 文件
    const vhdFileContent = fs.readFileSync(vhdFile)
    if (!checkVhdValid(vhdFileContent.slice(-512))) {
        throw new Error('vhd文件格式错误')
    }

    // 将要写入的二进制文件
    const binData = fs.readFileSync(binDataFile)
    const binDataLength = binData.length
    let offset = 512 * sector
    if (sector === 0) {
        // 从引导扇区开始写(逻辑0扇区)
        if (!force && binDataLength >= 512 && (binData[510] !== 0x55 || binData[511] !== 0xAA)) {
            throw new Error(`写入引导扇区(MBR)的内容校验未通过`)
        }
        if (binDataLength > 466) {
            console.warn('写入引导扇区的内容已超过466字节，有可能会导致分区表破坏')
        }
        // 写入校验位
        vhdFileContent[510] = 0x55
        vhdFileContent[511] = 0xAA
    }

    // todo: 这里要检测offset是否大于vhdFileContent内容
    if (offset + binDataLength > vhdFileContent.length) {
        throw new Error(`写入内容(${offset}+${binDataLength})超过虚拟硬盘容量(${vhdFileContent.length})`)
    }
    for (let i = 0; i < binDataLength; i++) {
        vhdFileContent[offset++] = binData[i]
    }


    // 覆盖掉原始文件
    fs.writeFileSync(vhdFile, vhdFileContent)
    console.log('写入成功')
}


module.exports = {
    writeBinDataToVhdFile,
    readFooterFromVDisk,
    readHeaderFromVDisk,
    resolveVDiskType,
}
