const { writeBufferToFile } = require('../shared/utils')

const buffer = Buffer.from('12', 'utf-8')
console.log(buffer)
writeBufferToFile('test/test.txt', buffer, 3, false)
