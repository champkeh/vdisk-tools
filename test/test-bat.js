const { allocBuffer, hexBufferToNumber, ctorBAT } = require('../shared/utils')

const buf = allocBuffer(16, 0)
buf[2] = 2
buf[14] = 1

console.log(buf)

const bat = ctorBAT(buf)
console.log(bat)
