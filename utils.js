const fs = require('fs')

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

function checkVhdValid(footer) {
    // console.log(footer)
    // todo(champ): 这里尝试解析 vhd footer 结构，如果失败则说明不是合法的 vhd 文件
    return true
}

/**
 * 读取虚拟磁盘文件的Footer结构(最后512字节)
 * @param vhdFile
 */
function readFooterFromVDisk(vhdFile) {
    const vhdFileContent = fs.readFileSync(vhdFile)
    if (vhdFileContent.length < 512) {
        throw new Error('vdisk file not valid')
    }
    return vhdFileContent.slice(-512)
}

/**
 * 读取虚拟磁盘文件的Header结构(1024字节)
 * @param vhdFile
 */
function readHeaderFromVDisk(vhdFile) {
    const vhdFileContent = fs.readFileSync(vhdFile)
    if (vhdFileContent.length < 512+1024) {
        throw new Error('vdisk file not valid')
    }
    return vhdFileContent.slice(512, 1536)
}

/**
 * 16进制的buffer转为10进制的数字
 * @param buffer
 * @return {number}
 */
function hexBufferToNumber(buffer) {
    return parseInt(buffer.toString('hex'), 16)
}

/**
 * 根据4字节的buffer计算版本号
 * @param buf4
 * @return {string}
 */
function calcVersionFromBuffer4(buf4) {
    const major = hexBufferToNumber(buf4.slice(0, 2))
    const minor = hexBufferToNumber(buf4.slice(2, 4))
    return `${major}.${minor}`
}

/**
 * CHS Calculation
 * @param totalSectors
 */
function chsCalc(totalSectors) {
    if (totalSectors > 65535 * 16 * 255) {
        totalSectors = 65535 * 16 * 255
    }

    let sectorsPerTrack = 0, heads = 0, cylinderTimesHeads = 0, cylinders = 0
    if (totalSectors >= 65535 * 16 * 63) {
        sectorsPerTrack = 255
        heads = 16
        cylinderTimesHeads = totalSectors / sectorsPerTrack
    } else {
        sectorsPerTrack = 17
        cylinderTimesHeads = totalSectors / sectorsPerTrack

        heads = (cylinderTimesHeads + 1023) / 1024

        if (heads < 4) {
            heads = 4
        }
        if (cylinderTimesHeads >= (heads * 1024) || heads > 16) {
            sectorsPerTrack = 31
            heads = 16
            cylinderTimesHeads = totalSectors / sectorsPerTrack
        }
        if (cylinderTimesHeads >= (heads * 1024)) {
            sectorsPerTrack = 63
            heads = 16
            cylinderTimesHeads = totalSectors / sectorsPerTrack
        }
    }
    cylinders = cylinderTimesHeads / heads

    // round down
    cylinders = Math.floor(cylinders)
    heads = Math.floor(heads)
    sectorsPerTrack = Math.floor(sectorsPerTrack)

    return [cylinders, heads, sectorsPerTrack]
}


module.exports = {
    writeBinDataToVhdFile,
    readFooterFromVDisk,
    readHeaderFromVDisk,
    hexBufferToNumber,
    calcVersionFromBuffer4,
    chsCalc,
}
