import React from 'react';
import { useState, useEffect, createRef } from 'react'
import 'wired-elements'
import './App.css';
// import HTextarea from './components/HTextarea'
import Part from './components/Part'
import LeftSide from './components/LeftList'
import swal from 'sweetalert'

async function getList () {
  let res = await fetch('../mockDataList')
  res = await res.json()
  return res
}

function App() {
  let apiPath = createRef()
  let mockData = createRef()
  let delayMs = createRef()
  const [list, setList] = useState([])
  // const [data, setData] = useState('')
  useEffect(() => {
    getList().then(res => {
      setList(res.data)
    })
  }, []) // 第二个参数传入Dep, 依赖更新才会再次调用这个useEffect, 空数组里没得更新, 所以只会调用一次
  async function refresh () {
    getList().then(res => {
      setList(res.data)
    })
  }

  async function submit (path, data, delayMs) {
    console.log('submit: ', path, data);
    const res =  await fetch('../addMockData', {
      method: 'POST',
      body: JSON.stringify({
        path, data, delayMs
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    let jsonRes
    try {
      jsonRes = await res.json()
    } catch (err) {
      jsonRes = await res.text()
    }
    console.log(jsonRes)
    refresh()
    return jsonRes 
  }
  // let handler = (v, e, t) => {
  //   console.log(v, e, t);
  //   // t.setState({
  //   //   content: ''
  //   // })
  // }

  let placeholder = `{
    "code": 403, // 可以自定义返回code, 默认200
    "data": {
      "xxx": "keke",
      "msg": "886"
    },
    "message": "啦啦啦啦" // 可以自定义返回message
 }
  OR--
  {
    "xxx": "keke",
    "msg": "886"
  }
 `

  return (
    <div className="App">
      <Part width="auto" height="100vh">
        <LeftSide apiList={list} refresh={refresh}></LeftSide>
      </Part>
      <main className="main-part">
        <section className="mock-item">
          <wired-input placeholder="api path" ref={apiPath}></wired-input>
          <wired-input placeholder="resp delay ms" ref={delayMs}></wired-input>
          {/* <HTextarea placeholder="hello boy" value={data} ref={mockData} inputHandler={handler}></HTextarea> */}
          <wired-textarea placeholder={placeholder} ref={mockData} rows="20" data-className="mock-data"></wired-textarea>
          <div className="mock-item-btn-box">
            <div className="mock-item-btn">
              <wired-button className="mock-item-btn"
                onClick={async () => {
                  // await submit(apiPath.current.value, mockData.current.state.content)
                  const res = await submit(apiPath.current.value, mockData.current.value, delayMs.current.value)
                  if (res.code === 200) {
                    apiPath.current.value = ''
                    mockData.current.value = ''
                    delayMs.current.value = ''
                    swal("Good job!", "Submit Success !", "success")
                  } else {
                    swal('Err code: ' + res.code, res.msg || 'No err Msg', 'error')
                  }
                }}
              >submit</wired-button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
