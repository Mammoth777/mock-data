import { get, post, http } from "./http";

const prefix = import.meta.env.PROD ? '' : '/api'

export function serverAlive() {
  return post(prefix + '/-meta-heyyo/alive').catch(err => {
    return {
      code: 500,
      message: err.msg
    }
  })
}

// '../addMockData'
export function addMockData(data) {
  return post(prefix + '/-meta-heyyo/addMockData', data).catch(err => {
    return {
      code: 500,
      message: err.msg
    }
  })
}

// mockDataList
export function getMockList() {
  return get(prefix + '/-meta-heyyo/mockDataList').catch(err => {
    return {
      code: 500,
      data: [],
      message: err.msg
    }
  })
}

export function delMockData(data) {
  return post(prefix + '/-meta-heyyo/delMockData', data).catch(err => {
    return {
      code: 500,
      message: err.msg
    }
  })
}

export function getMockApi(api) {
  return http(prefix + api)
}