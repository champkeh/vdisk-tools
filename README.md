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

## 为什么写这个项目？
最近在B站上看了几个计算机原理方面的视频，突然就来了兴趣，从三极管开始，搭建与/或/非/异或/同或等基本门电路，实现8位全加器等等，一发不可收拾，于是又买了《X86汇编语言：实模式到保护模式》系列课程，开始重新学习x86汇编。  
这个课程需要用到作者写的一个`FixVhdWr.exe`的工具，用来将汇编写的引导程序写入虚拟磁盘文件的MBR，从而在虚拟机上启动来查看效果，然而这个工具只有Windows版本，我身边又没有Windows操作系统，因此，就搜了一下`vhd`文件的格式规范，用`nodejs`重新实现了相关功能。  
作者为了教学目的只实现了`Fixed VHD`文件的写入，课程中所有的汇编程序都是写入到`Fixed VHD`磁盘上面的，我为了学习目的，自己实现了`Fixed`和`Dynamic`两种格式的`VHD`文件，并且写了`read/write/clear/inspect`等多个命令，算是实现了一个较完整的操作虚拟磁盘文件的工具。
