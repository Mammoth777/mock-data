const express = require('express')
const router = require('./router')
const app = express()
const bodyParser = require('body-parser')

// 解析urlencoded格式的请求体
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// 解析json格式的body
app.use(bodyParser.json({limit: '10mb'}))
app.use(express.static('dist'))

// 路由处理
app.use((req, res, next) => {
  console.log('get in service')
  console.log(req.path, 'path')
  next()
})
app.use(router)

app.listen(3000, _ => {
  console.log('app running on port 3000')
})