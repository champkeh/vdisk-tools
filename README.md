# FixVhdWr

> 跨平台的 FixVhdWr 工具

## 使用

###1. 下载
```shell
git clone git@github.com:champkeh/FixVhdWr.git
```

###2. 配置path

自行添加PATH变量包含该目录
```shell
export PATH=$PATH:/path/to/this/directory
```
  

###3. 写入(将`boot.bin`写入`x.vhd`文件的启动扇区)
```shell
fixvhdwr.js write x.vhd boot.bin
```

###4. 查看帮助
```shell
fixvhdwr.js write -h
```

```
Usage: fixvhdwr write [options] <vhd> <bin>

write special binary file to virtual hard disk(vhd)

Arguments:
  vhd                    virtual hard disk (.vhd format only)
  bin                    binary file

Options:
  -s, --sector <sector>  sector number to write begin (default: 0)
  -f, --force            force write (default: false)
  -h, --help             display help for command
```

## 说明
目前，该工具还只能用于固定大小的vhd文件，后续可能会增加对动态vhd文件的支持
