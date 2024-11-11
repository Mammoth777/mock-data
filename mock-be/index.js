#!/usr/bin/env node

import express from 'express'
import process from 'process'
import router from './router.js'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
const app = express()

const staticPath = fileURLToPath(new URL('../dist', import.meta.url))

// 解析urlencoded格式的请求体
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// 解析json格式的body
app.use(bodyParser.json({limit: '10mb'}))
app.use(express.static(staticPath))

// 路由处理
app.use((req, res, next) => {
  console.log('get in service')
  console.log(req.path, 'path')
  next()
})
app.use(router)

app.listen(3000, () => {
  console.log('App running on port 3000')
})

// 监听信号并优雅地关闭应用
process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  process.exit();
});