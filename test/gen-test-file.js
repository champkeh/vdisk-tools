// 生产测试数据文件
const fs = require('fs')
const { writeBufferToFile } = require('../shared/utils')

const config = [
    { name: 'data/500b.data', size: 500 },
    { name: 'data/512b.data', size: 512 },
    { name: 'data/800b.data', size: 800 },
    { name: 'data/1k.data', size: 1024 },
    { name: 'data/2k.data', size: 1024 * 2 },
    { name: 'data/5k.data', size: 1024 * 5 },
    { name: 'data/10k.data', size: 1024 * 10 },
    { name: 'data/2m.data', size: 1024 * 1024 * 2 },
]


config.forEach(c => {
    gen(c.name, c.size)
})

function gen(filepath, size) {
    // 确保文件存在，如果已经存在，则截断
    fs.closeSync(fs.openSync(filepath, 'w'))

    const data = Buffer.alloc(size, 0xCC)
    writeBufferToFile(filepath, data, 0, true)
}
