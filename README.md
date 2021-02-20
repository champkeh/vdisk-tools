# vdisk-tools

> 操作虚拟磁盘文件(virtual disk)的工具。
> 目前支持的虚拟磁盘文件规范如下表:  
>
> 文件规范| 文件类型 | 支持情况
> --- |   ---   |  ---
> vhd | fixed   | 支持
> vhd | dynamic | 支持
> vhd | differencing | 暂不支持


## Install
```shell
npm install -g vdisk
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

### 按照LBA逻辑扇区号读取磁盘内容
```shell
# 从虚拟磁盘 disk.vhd 的第100扇区(以0开头)处开始，读取2个扇区的内容
vdisk read disk.vhd -s 100 -c 2
```

### 查看虚拟磁盘文件的header/footer结构
```shell
vdisk inspect disk.vhd
```

### 清空虚拟磁盘文件
```shell
vdisk clear disk.vhd
```

### 生成虚拟磁盘内容的结构图(coming soon)
```shell
vdisk graph disk.vhd
```

### 查看帮助
```shell
vdisk --help

# 输出
Usage: vdisk [options] [command]

Options:
  -v, --version                output the current version
  -h, --help                   display help for command

Commands:
  inspect <vhd>                inspect virtual disk file structure
  read [options] <vhd>         read sector data from virtual disk file
  write [options] <vhd> <bin>  write special binary file to virtual disk file
  clear <vhd>                  clear virtual disk file content
  help [command]               display help for command
```

## 规范文档

1. [Virtual Hard Disk Image Format Specification(2006)](specs/Virtual%20Hard%20Disk%20Format%20Spec_10_18_06.doc)
2. [Virtual Hard Disk v2 (VHDX) File Format](specs/MS-VHDX.pdf)
