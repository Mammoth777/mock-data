# mock data

启动一个本地服务， 用于存储模拟数据， 并提供接口; 前端开发时， 通过接口获取模拟数据

![常规界面](https://raw.githubusercontent.com/Mammoth777/mock-data/refs/heads/master/1.png)

![2](https://raw.githubusercontent.com/Mammoth777/mock-data/refs/heads/master/2.png)

## 使用方式

启动： 

`npx @jachy/mockdata`

## 开发

- `git clone ` project
- `npm i`
- `npm start`


## todo

- [x] 本地启动， 放弃mongodb， 直接用sqlite得了
- [x] 通过 `npx` 启动此服务
- [x] 根据配置启动
- [ ] 局域网内，组播广播，服务发现，同步mock数据
- [ ] 存储时， 根据数据结构， 生成一份"空值数据"

- [ ] 优化左侧list展示效果

