// 注意: VDI 文件采用Big-Endian大端字节序

class VDIHeader {
    constructor(header) {
        this.imageFileInfo = header.slice(0, 64)
        this.imageSignature = header.slice(64, 68)
        this.vdiVersion = header.slice(68, 72)
        this.headerSize = header.slice(72, 76)
        this.imageType = header.slice(76, 80)
    }

    toJSON() {
        const imageFileInfo = this.imageFileInfo

        return {
            imageFileInfo
        }
    }
}

module.exports = VDIHeader
