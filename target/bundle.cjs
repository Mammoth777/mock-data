'use strict';

var express = require('express');
var process = require('process');
var Database = require('better-sqlite3');
var bodyParser = require('body-parser');

const db = new Database('mockdata.db');

function createTable() {
  const stmt = db.prepare('CREATE TABLE IF NOT EXISTS "api_mock" ("id" integer,"path" varchar,"data" text,"code" int DEFAULT 200,"message" varchar,"delay_ms" int DEFAULT 0, "format" varchar DEFAULT "plaintext", PRIMARY KEY (id))');
  const result = stmt.run();
  if (result.changes > 0) {
    console.log('create table api_mock success');
  }
  return result;
}

createTable();

async function addMockApi(mockData) {
  if (!mockData) {
    return
  }
  const stmt = db.prepare('INSERT INTO api_mock (path, data, code, message, delay_ms) VALUES (?, ?, ?, ?, ?)');
  return stmt.run(mockData.path, mockData.data, mockData.code || 200, mockData.message, mockData.delayMs || 0);
}

/**
 * 查找单个或全部mock接口
 */
async function findMockApi(path) {
  if (!path) {
    const stmt = db.prepare('SELECT * FROM api_mock');
    return stmt.all();
  } else {
    const stmt = db.prepare('SELECT * FROM api_mock WHERE path = ?');
    return stmt.get(path);
  }
}

async function delMockApi(path) {
  if (!path) {
    return
  }
  const stmt = db.prepare('DELETE FROM api_mock WHERE path = ?');
  return stmt.run(path);
}

const router = express.Router();

router.post('/addMockData', async (req, res) => {
  let { data, path, code, message, delayMs } = req.body;
  if (!data || !path) {
    res.json({
      code: 400,
      msg: 'path and mock data need to be send'
    });
  }

  // done TODO 验证路径格式
  const urlReg = /^\/[\w-]+(\.?[\w-]+)*([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
  if (!urlReg.test(path)) {
    res.json({
      code: 400,
      // eslint-disable-next-line no-useless-escape
      msg: 'path 不是url格式, 正则: -->  /^\/[\w\-]+(\.?[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/  <--',
    });
    return
  }

  // done todo 过滤mock data 1. 验证json格式. 去掉多余数据
  let errMsg = '';
  try {
    let mockData = typeof data === 'string' ? JSON.parse(data) : data;
    if (mockData.data) {
      data = JSON.stringify(mockData.data);
    } else {
      data = JSON.stringify(mockData);
    }
    if (mockData.code) {
      code = mockData.code;
    }
    if (mockData.message) {
      message = mockData.message;
    }
  } catch (err) {
    errMsg = err.message;
  }

  if (errMsg) {
    res.json({
      code: 400,
      msg: "mock data must be json format",
      errMsg
    });
  } else {
    const result = addMockApi({
      data, path, code, message, delayMs
    }).catch(err => {
      console.log(err, 'err');
      return err
    });
    res.json({
      code: 200,
      data: result
    });
  }
});

router.post('/delMockData', async (req, res) => {
  // done todo
  const { path } = req.body;
  const dbRes = await delMockApi(path);
  res.json({
    code: 200,
    data: dbRes
  });
});

router.get('/mockDataList', async (req, res) => {
  // done todo 
  const list = await findMockApi();
  res.json({
    code: 200,
    data: list
  });
});

// 拦截全部请求
router.use(async (req, res) => {
  // 1. 获取请求路径
  const path = req.path;
  const mockData = await findMockApi(path);
  let data = null;
  try {
    data = typeof mockData.data === 'string' ? JSON.parse(mockData.data) : mockData;
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
      });
    }, mockData.delayMs);
  } else {
    res.json({
      code: mockData.code,
      path,
      data: mockData,
      msg: '数据解析失败, 因为不是json格式;'
    });
  }

});

const app = express();

// 解析urlencoded格式的请求体
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// 解析json格式的body
app.use(bodyParser.json({limit: '10mb'}));
app.use(express.static('dist'));

// 路由处理
app.use((req, res, next) => {
  console.log('get in service');
  console.log(req.path, 'path');
  next();
});
app.use(router);

app.listen(3000, () => {
  console.log('app running on port 3000');
});

// 监听信号并优雅地关闭应用
process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  process.exit();
});
