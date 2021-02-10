# FixVhdWr

> 跨平台的 FixVhdWr 工具

## 使用

1. 下载
```shell
git clone git@github.com:champkeh/FixVhdWr.git
```

2. 配置path

自行添加PATH变量包含该目录，或者将目录下的`fixvhdwr.js`和`utils.js`文件拷贝到`/usr/local/bin`
  

3. 写入(将`boot.bin`写入`x.vhd`文件的启动扇区)
```shell
./fixvhdwr.js --vhd x.vhd --boot boot.bin
```

## 说明
目前，该工具还只能用于固定大小的vhd文件，后续可能会增加对动态vhd文件的支持
