const { writeCommand } = require('../commands/write')

// 写入动态文件
// writeCommand('/Users/champ/vms/disks/dynamic8m.vhd', 'test/data/800b.data', 16382)

// 写入静态文件
writeCommand('/Users/champ/vms/disks/fixed4m.vhd', 'test/data/800b.data', 8190)
