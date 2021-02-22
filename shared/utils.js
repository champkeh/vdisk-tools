const fs = require('fs')
const { error } = require('./log')

/**
 * 从文件中读取数据
 * @param file
 * @param offset
 * @param length
 */
function readBufferFromFile(file, offset, length) {
    // todo: 优化大文件读取，采用流式处理
    const fileContent = fs.readFileSync(file)
    if (fileContent.length < offset + length) {
        throw new Error('read too many content from file that exceed content\'s size')
    }
    return fileContent.slice(offset, offset+length)
}

/**
 * 从指定偏移处读取到文件结尾
 * @param file
 * @param offset
 * @return {Buffer}
 */
function readBufferFromFileToEnd(file, offset) {
    const fileContent = fs.readFileSync(file)
    if (fileContent.length < Math.abs(offset)) {
        throw new Error('read too many content from file that exceed content\'s size')
    }
    return fileContent.slice(offset)
}

/**
 * 向文件file写入buffer数据，写入位置为offset(原始文件大小不会改变，不适合动态增加内容的写入操作)
 * @param file
 * @param data
 * @param offset
 * @param append 是否追加 (默认为覆写)
 */
function writeBufferToFile(file, data, offset, append = false) {
    let fileContent = fs.readFileSync(file)
    const originContentLength = fileContent.length

    // 计算是否需要扩展及扩展长度
    if (!append && originContentLength < offset + data.length) {
        // 需要扩展buffer
        const expand = offset + data.length - originContentLength
        const expandBuffer = Buffer.alloc(expand, 0)
        fileContent = Buffer.concat([fileContent, expandBuffer])
    } else if (append) {
        const expand = data.length
        const expandBuffer = Buffer.alloc(expand, 0)
        fileContent = Buffer.concat([fileContent, expandBuffer])
    }

    // 移动offset后面的内容
    if (append) {
        for (let i = originContentLength-1; i >= offset; i--) {
            fileContent[i+data.length] = fileContent[i]
        }
    }

    // 写入新内容
    for (let i = 0; i < data.length; i++) {
        fileContent[offset++] = data[i]
    }

    // 写入原文件
    fs.writeFileSync(file, fileContent)
    return true
}


/**
 * 16进制的buffer转为10进制的数字
 * @param buffer
 * @return {number}
 */
function hexBufferToNumber(buffer) {
    return parseInt(buffer.toString('hex'), 16)
}

function numberToHexBuffer(num, len) {
    const hex = align(num.toString(16), 2*len)
    const arr = []
    for (let i = 0; i < hex.length; i+=2) {
        arr.push(hex.slice(i, i+2))
    }
    return Buffer.from(arr)
}

/**
 * 计算bitmap对应数位
 * @param startSector 起始扇区号
 * @param sectorCount 写了多少个扇区数据
 */
function calcBitmapNumber(startSector, sectorCount) {
    // 0,1 => 10000000b => 0x80
    // 2,2 => 00110000b => 0x30
    // 10,5 => 00000000 00111110b => 0x00 0x63
}

function align(str, len) {
    if (str.length < len) {
        return '0'.repeat(len - str.length) + str
    }
    return str
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


const BlockBitmapSectorCount = 1

/**
 * 映射磁盘扇区(逻辑扇区)到Block内扇区
 */
function mappingDiskSectorToBlockSector(rawSectorNumber, sectorsPerBlock, bat) {
    const blockNumber = Math.floor(rawSectorNumber / sectorsPerBlock)
    const sectorInBlock = rawSectorNumber % sectorsPerBlock

    const actualSectorLocation = bat[blockNumber] + (BlockBitmapSectorCount + sectorInBlock) * 512
}

function executeCommand(command, debug) {
    try {
        command()
    } catch (e) {
        debug ? error(e.message) : console.log(e)
    }
}

module.exports = {
    readBufferFromFile,
    readBufferFromFileToEnd,
    writeBufferToFile,
    hexBufferToNumber,
    numberToHexBuffer,
    calcVersionFromBuffer4,
    chsCalc,
    executeCommand,
}
