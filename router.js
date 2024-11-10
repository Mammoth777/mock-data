const express = require('express')
const router = express.Router()
const { addMockApi, findMockApi, delMockApi } = require('./db')

router.post('/addMockData', async (req, res) => {
  let { data, path, code, message, delayMs } = req.body
  if (!data || !path) {
    res.json({
      code: 400,
      msg: 'path and mock data need to be send'
    })
  }

  // done TODO 验证路径格式
  const urlReg = /^\/[\w-]+(\.?[\w-]+)*([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/
  if (!urlReg.test(path)) {
    res.json({
      code: 400,
      // eslint-disable-next-line no-useless-escape
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
      errMsg
    })
  } else {
    const result = addMockApi({
      data, path, code, message, delayMs
    }).catch(err => {
      console.log(err, 'err')
      return err
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
  const dbRes = await delMockApi(path)
  res.json({
    code: 200,
    data: dbRes
  })
})

router.get('/mockDataList', async (req, res) => {
  // done todo 
  const list = await findMockApi();
  res.json({
    code: 200,
    data: list
  })
})

// 拦截全部请求
router.use(async (req, res) => {
  // 1. 获取请求路径
  const path = req.path
  const mockData = await findMockApi(path)
  let data = null
  try {
    data = typeof mockData.data === 'string' ? JSON.parse(mockData.data) : mockData
  } catch (err) {
    console.log(err);
  }
  if (data) {
    // 延迟返回
    setTimeout(() => {
      res.json({
        code: mockData.code,
        path,
        data,
        message: mockData.message || ''
      })
    }, mockData.delayMs);
  } else {
    res.json({
      code: mockData.code,
      path,
      data: mockData,
      msg: '数据解析失败, 因为不是json格式;'
    })
  }

})

module.exports = router