const Database = require('better-sqlite3');

const db = new Database('mockdata.db');

function createTable() {
  const stmt = db.prepare('CREATE TABLE IF NOT EXISTS "api_mock" ("id" integer,"path" varchar,"data" text,"code" int DEFAULT 200,"message" varchar,"delay_ms" int DEFAULT 0, "format" varchar DEFAULT "plaintext", PRIMARY KEY (id))');
  const result = stmt.run();
  console.log('create table api_mock result:', result);
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

module.exports = {
  addMockApi,
  findMockApi,
  delMockApi
}