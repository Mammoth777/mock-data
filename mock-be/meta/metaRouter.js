import { Router } from "express"
import { addMockApi, findMockApi, delMockApi } from '../db.js'
import VERSION from "../../.VERSION.js"

const router = Router()

router.post('/alive', (req, res) => {
  res.json({
    code: 200,
    data: VERSION,
    msg: 'alive'
  })
})

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

export default router