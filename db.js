// https://www.mongodb.org.cn/drivers/5.html
const MongoClient = require('mongodb').MongoClient
const DB_URL = 'mongodb://localhost:27017/apiMockData';

/**
 * 连接数据库, Promise形式
 */
async function connect () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_URL, function(err, db) {
      if (err) {
        console.error(err);
        reject(err)
        return;
      } else {
        console.log("Connected correctly to server");
        resolve(db)
        // db.close();
      }
    })
  })
}

/**
 * 新增mock数据
 * @param {object} mockData
 */
async function addPathMock (mockData) {
  if (!mockData) {
    return
  }
  const db = await connect()
  const collection = db.collection('apiMock')
  return new Promise((resolve, reject) => {
    // 有则更新, 无则插入
    collection.update({ path: mockData.path }, mockData, { upsert: true }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
        db.close()
      }
    })
  })
}

/**
 * 获取模拟数据列表
 */
async function findAllMock () {
  const db = await connect()
  const collection = db.collection('apiMock')
  return new Promise((resolve, reject) => {
    // 查询并过滤掉 _id
    collection.find({}, { _id: 0 }).toArray((err, docs) => {
      if (err) {
        reject(err)
      } else {
        console.log('find resolve: ' + docs.length)
        resolve(docs)
      }
    })
  })
}

/**
 * 根据请求路径, 从数据库里获取mock数据
 * @param {string} path 请求路径
 */
async function findMockByPath (path) {
  const db = await connect()
  const collection = db.collection('apiMock')
  return new Promise((resolve, reject) => {
    collection.findOne({path}, { _id: 0 }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        console.log('find resolve: ' + doc)
        resolve(doc)
      }
    })
  })
}

/**
 * 删除一条数据
 * @param {string} apiPath
 */
async function delPathMock (apiPath) {
  if (!apiPath) {
    return
  }
  const db = await connect()
  const collection = db.collection('apiMock')
  return new Promise((resolve, reject) => {
    collection.deleteOne({path: apiPath}, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  addPathMock,
  findAllMock,
  findMockByPath,
  delPathMock
}