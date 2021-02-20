const { hexBufferToNumber, calcVersionFromBuffer4 } = require('../../shared/utils')

class HardDiskHeader {
    constructor(header) {
        this.cookie = header.slice(0, 8)
        this.dataOffset = header.slice(8, 16)
        this.tableOffset = header.slice(16, 24)
        this.headerVersion = header.slice(24, 28)
        this.maxTableEntries = header.slice(28, 32)
        this.blockSize = header.slice(32, 36)
        this.checksum = header.slice(36, 40)
        this.parentUniqueID = header.slice(40, 56)
        this.parentTimeStamp = header.slice(56, 60)
        this.reserved = header.slice(60, 64)
        this.parentUnicodeName = header.slice(64, 576)
        this.parentLocatorEntry1 = header.slice(576, 600)
        this.parentLocatorEntry2 = header.slice(600, 624)
        this.parentLocatorEntry3 = header.slice(624, 648)
        this.parentLocatorEntry4 = header.slice(648, 672)
        this.parentLocatorEntry5 = header.slice(672, 696)
        this.parentLocatorEntry6 = header.slice(696, 720)
        this.parentLocatorEntry7 = header.slice(720, 744)
        this.parentLocatorEntry8 = header.slice(744, 768)
        this.reserved = header.slice(768, 1024)
    }

    toJSON() {
        const cookie = Buffer.from(this.cookie).toString()
        const dataOffset = this.dataOffset
        const tableOffset = hexBufferToNumber(this.tableOffset)
        const headerVersion = calcVersionFromBuffer4(this.headerVersion)
        const maxTableEntries = hexBufferToNumber(this.maxTableEntries)
        const blockSize = hexBufferToNumber(this.blockSize)
        const checksum = hexBufferToNumber(this.checksum)

        return {
            cookie,
            dataOffset,
            tableOffset,
            headerVersion,
            maxTableEntries,
            blockSize,
            checksum,
        }
    }
}

module.exports = HardDiskHeader
