const { Db } = require('mongodb');

// https://www.mongodb.org.cn/drivers/5.html
const MongoClient = require('mongodb').MongoClient
const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const client = new MongoClient(DB_URL);
/**
 * 连接数据库, Promise形式
 * @returns {Promise<Db>}
 */
async function connect () {
  const db = client.db('apiMockData')
  return db
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
  return collection.updateOne({ path: mockData.path }, { $set: mockData }, { upsert: true })
}

/**
 * 获取模拟数据列表
 */
async function findAllMock () {
  const db = await connect()
  const collection = db.collection('apiMock')
  // 查询并过滤掉 _id
  const mocks = collection.find({}, { _id: 0 })
  const list = await mocks.toArray()
  return list
}

/**
 * 根据请求路径, 从数据库里获取mock数据
 * @param {string} path 请求路径
 */
async function findMockByPath (path) {
  const db = await connect()
  const collection = db.collection('apiMock')
  const doc = await collection.findOne({path}, { _id: 0 })
  return doc
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
  return collection.deleteOne({path: apiPath})
}

module.exports = {
  addPathMock,
  findAllMock,
  findMockByPath,
  delPathMock
}