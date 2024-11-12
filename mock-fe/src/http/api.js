import { get, post, http } from "./http";

// '../addMockData'
export function addMockData(data) {
  return post('/addMockData', data)
}

// mockDataList
export function getMockList() {
  return get('/mockDataList')
}

export function delMockData(data) {
  return post('/delMockData', data)
}

export function getMockApi(api) {
  return http(api)
}