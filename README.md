# san-template-loader

`san-template-loader`是一个可以将san文件中的模板编译为aPack 或 aNode的一个webpack loader

## 安装

目前只发布了百度内网包，后续考虑开源
```
npm install @baidu/san-apack-loader --registry=http://registry.npm.baidu-int.com/
```

## 使用

```js
{
    loader: '@baidu/san-apack-loader',
    options: {
        compileTemplate: 'aPack',
        mode: 'compact'
    }
}
```
其中，option的作用：
1. compileTemplate 选择将template转换成anode/apack
2. mode 严格模式strict/兼容模式compact  严格模式下，template不可以出现字符串表达式，否则会报错，兼容模式下，会跳过有字符串表达式的template


## 问题反馈
可移步 [san discussion](https://github.com/baidu/san/discussions) 讨论区

## License
MIT © [luoyimaid](https://github.com/luoyimaid)
