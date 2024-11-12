import { get, post, http } from "./http";

const prefix = import.meta.env.PROD ? '' : '/api'

// '../addMockData'
export function addMockData(data) {
  return post(prefix + '/addMockData', data)
}

// mockDataList
export function getMockList() {
  return get(prefix + '/mockDataList')
}

export function delMockData(data) {
  return post(prefix + '/delMockData', data)
}

export function getMockApi(api) {
  return http(prefix + api)
}