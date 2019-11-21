const express = require('express')
const router = express.Router()
const { addPathMock, findAllMock, findMockByPath, delPathMock } = require('./db')

router.post('/addMockData', async (req, res) => {
  console.log(req.body, 'body')
  let { data, path, code, message } = req.body
  if (!data || !path) {
    res.json({
      code: 400,
      msg: 'path and mock data need to be send'
    })
  }

  // done TODO 验证路径格式
  const urlReg = /^\/[\w\-]+(\.?[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/
  if (!urlReg.test(path)) {
    res.json({
      code: 400,
      msg: 'path 不是url格式, 正则: -->  /^\/[\w\-]+(\.?[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/  <--',
    })
    return
  }

  // done todo 过滤mock data 1. 验证json格式. 去掉多余数据
  let errMsg = ''
  try {
    let mockData = typeof data === 'string' ? JSON.parse(data) : data
    if (mockData.data) {
      data = JSON.stringify(mockData.data)
    } else {
      data = JSON.stringify(mockData)
    }
    if (mockData.code) {
      code = mockData.code
    }
    if (mockData.message) {
      message = mockData.message
    }
  } catch (err) {
    errMsg = err.message
  }

  if (errMsg) {
    res.json({
      code: 400,
      msg: "mock data must be json format",
      errMsg: err.message
    })
  } else {
    // done todo 有则改之, 无则创建
    const result = await addPathMock({
      data, path, code, message
    })
    res.json({
      code: 200,
      data: result
    })
  }
})

router.post('/delMockData', async (req, res) => {
  // done todo
  const { path } = req.body
  console.log(req.body)
  const dbRes = await delPathMock(path)
  let flag = dbRes && dbRes.result && dbRes.result.n > 0
  res.json({
    code: 200,
    data: flag,
    msg: flag ? 'success' : '没有这个API path: ' + path
  })
})

router.get('/mockDataList', async (req, res) => {
  // done todo 
  const docs = await findAllMock()
  res.json({
    code: 200,
    data: docs
  })
})

// 拦截全部请求
router.use(async (req, res) => {
  // 1. 获取请求路径
  const path = req.path
  const mockData = await findMockByPath(path)
  let data = null
  try {
    // done fix 这里解析好像有问题
    data = typeof mockData.data === 'string' ? JSON.parse(mockData.data) : mockData
  } catch (err) {
    console.log(err);
  }
  if (data) {
    res.json({
      code: mockData.code || 200,
      path,
      data,
      message: mockData.message || ''
    })
  } else {
    res.json({
      code: mockData.code || 200,
      path,
      data: mockData,
      msg: '数据解析失败, 因为不是json格式'
    })
  }

})

module.exports = router