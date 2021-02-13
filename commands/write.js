const {writeBinDataToVhdFile} = require('../utils')

function write(vhdFilePath, binFilePath, sector, force) {
    writeBinDataToVhdFile(vhdFilePath, binFilePath, sector, force)
}

module.exports = {
    write
}
