# vdisk-tools

> 操作虚拟磁盘文件(virtual disk)的工具。
> 目前支持的虚拟磁盘文件规范如下表:  
>
> 文件规范| 小类 | 支持情况
> --- |   ---   |  ---
> vhd | fixed   | 支持
> vhd | dynamic | coming soon
> vhd | difference | 暂不支持


## Install
```shell
npm install -g vdisk-tools
```

## Example

### 向虚拟磁盘的启动扇区(逻辑0扇区)写入程序
```shell
# 将 boot.bin 程序写入 disk.vhd 文件的启动扇区
vdisk write disk.vhd boot.bin
```

### 向虚拟磁盘的指定扇区处写入数据
```shell
# 从虚拟磁盘 disk.vhd 的第100扇区(以0开头)开始，写入 data.bin 文件内容
vdisk write disk.vhd data.bin -s 100
```

### 查看帮助
```shell
vdisk write -h

# 输出
Usage: vdisk write [options] <vhd> <bin>

write special binary file to virtual hard disk(vhd)

Arguments:
  vhd                    virtual hard disk (.vhd format only)
  bin                    binary file

Options:
  -s, --sector <sector>  sector number to write begin (default: 0)
  -f, --force            force write (default: false)
  -h, --help             display help for command
```
