const { hexBufferToNumber, calcVersionFromBuffer4 } = require('../shared/utils')
const SnJsUtils = require('sn-js-utils')


const FeaturesMap = {
    2: 'None',
    3: 'Temporary'
}
const DiskTypeMap = {
    0: 'None',
    1: 'Reserved (deprecated)',
    2: 'Fixed hard disk',
    3: 'Dynamic hard disk',
    4: 'Differencing hard disk',
    5: 'Reserved (deprecated)',
    6: 'Reserved (deprecated)',
}

class HardDiskFooter {
    constructor(footer) {
        this.cookie = footer.slice(0, 8)
        this.features = footer.slice(8, 12)
        this.fileFormatVersion = footer.slice(12, 16)
        this.dataOffset = footer.slice(16, 24)
        this.timeStamp = footer.slice(24, 28)
        this.creatorApplication = footer.slice(28, 32)
        this.creatorVersion = footer.slice(32, 36)
        this.creatorHostOS = footer.slice(36, 40)
        this.originSize = footer.slice(40, 48)
        this.currentSize = footer.slice(48, 56)
        this.diskGeometry = footer.slice(56, 60)
        this.diskType = footer.slice(60, 64)
        this.checksum = footer.slice(64, 68)
        this.uuid = footer.slice(68, 84)
        this.savedState = footer.slice(84, 85)
        this.reserved = footer.slice(85, 512)
    }

    toJSON() {
        const cookie = Buffer.from(this.cookie).toString()
        const features = FeaturesMap[hexBufferToNumber(this.features)]
        const fileFormatVersion = calcVersionFromBuffer4(this.fileFormatVersion)
        const dataOffset = this.dataOffset

        // 文件创建时间，好像有问题
        const ts = hexBufferToNumber(this.timeStamp)
        const timeStamp = SnJsUtils.DateUtil.dateAfter('2000-01-01 12:00:00', {hour:-4,second:ts}, 'yyyy-MM-dd HH:mm:ss')

        const creatorApplication = Buffer.from(this.creatorApplication).toString()
        const creatorVersion = calcVersionFromBuffer4(this.creatorVersion)
        const creatorHostOS = Buffer.from(this.creatorHostOS).toString()
        const originSize = hexBufferToNumber(this.originSize)
        const currentSize = hexBufferToNumber(this.currentSize)

        const diskGeometry = `<c:${hexBufferToNumber(this.diskGeometry.slice(0, 2))}, h:${hexBufferToNumber(this.diskGeometry.slice(2, 3))}, s:${hexBufferToNumber(this.diskGeometry.slice(3, 4))}>`

        const diskType = DiskTypeMap[hexBufferToNumber(this.diskType)]
        const checksum = hexBufferToNumber(this.checksum)
        const uuid = this.uuid
        const savedState = hexBufferToNumber(this.savedState) === 1

        return {
            cookie,
            features,
            fileFormatVersion,
            dataOffset,
            timeStamp,
            creatorApplication,
            creatorVersion,
            creatorHostOS,
            originSize,
            currentSize,
            diskGeometry,
            diskType,
            checksum,
            uuid,
            savedState,
        }
    }
}

module.exports = HardDiskFooter
