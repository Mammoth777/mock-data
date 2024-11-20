# mock data

场景1: 新功能开发前，格式已确定，后端接口不通。 
场景2: 当前功能在现场有问题， 但现场环境无法复现。

解决方案：
- 本地启动一个服务， 快速配置模拟接口返回值

![常规界面](https://raw.githubusercontent.com/Mammoth777/mock-data/refs/heads/master/1.png)

![2](https://raw.githubusercontent.com/Mammoth777/mock-data/refs/heads/master/2.png)

## 使用方式

启动： 

`npx @jachy/mockdata`

## 开发

- `git clone ` project
- `npm i`
- `npm run dev:be`
- `npm run dev:fe`


## todo

- [x] 本地启动， 放弃mongodb， 直接用sqlite得了
- [x] 通过 `npx` 启动此服务
- [x] 根据配置启动
- [ ] 局域网内，组播广播，服务发现，同步mock数据
- [ ] 存储时， 根据数据结构， 生成一份"空值数据"

- [ ] 优化左侧list展示效果

