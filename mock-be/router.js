import express from 'express'
import { findMockApi } from './db.js'
import metaRotuter from './meta/metaRouter.js'

const router = express.Router()

router.use('/-meta-heyyo', metaRotuter)

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
    }, mockData.delay_ms);
  } else {
    res.json({
      code: mockData.code,
      path,
      data: mockData,
      msg: '数据解析失败, 因为不是json格式;'
    })
  }

})

export default router