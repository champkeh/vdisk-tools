const fs = require('fs')

/**
 * 将二进制文件binDataFile的内容写入vhd文件中
 * @param vhdFile {String} 虚拟硬盘文件路径
 * @param binDataFile {String} 二进制文件路径
 */
function writeBinDataToVhdFile(vhdFile, binDataFile) {
    // 读取原始 vhd 文件
    const vhdFileContent = fs.readFileSync(vhdFile)
    if (!checkVhdValid(vhdFileContent.slice(-512))) {
        throw new Error('vhd文件格式错误')
    }

    // 将要写入的文件写入
    const binData = fs.readFileSync(binDataFile)
    // 验证要写入的内容是否大于466字节
    if (binData.length > 466) {
        throw new Error('写入引导扇区(MBR)的内容不得超过466字节')
    }
    for (let i = 0; i < binData.length; i++) {
        vhdFileContent[i] = binData[i]
    }
    // 写入校验位
    vhdFileContent[510] = 0x55
    vhdFileContent[511] = 0xAA

    // 覆盖掉原始文件
    fs.writeFileSync(vhdFile, vhdFileContent)
    console.log('写入成功')
}

function checkVhdValid(footer) {
    console.log(footer)
    // todo(champ): 这里尝试解析 vhd footer 结构，如果失败则说明不是合法的 vhd 文件
    return true
}

module.exports = {
    writeBinDataToVhdFile
}
