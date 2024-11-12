import { useState, useEffect, createRef } from 'react'
import 'wired-elements'
import './App.css';
// import HTextarea from './components/HTextarea'
import Part from './components/Part'
import LeftSide from './components/LeftList'
import swal from 'sweetalert'
import ResBody from './components/ResBody'
import GlobalMessage from './components/GlobalMessage';
import { addMockData, getMockList } from './http/api'

async function getList () {
  let res
  try {
    res = await getMockList()
  } catch (e) {
    alert('server error' + e.message)
  }
  return res
}

function initPasteEvent (setData, popMsg) {
  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedStr = clipboardData.getData('Text');
    try {
      // remote comment
      const temp = pastedStr.replace(/\/\/.*/g, '')
      const pastedJsonObj = JSON.parse(temp)
      setData(pastedJsonObj)
      popMsg('Paste success')
    } catch (err) {
      setData(pastedStr)
      popMsg('Not in JSON format')
      console.log(err.message)
      return
    }
  };

  // 添加全局粘贴事件监听器
  document.addEventListener('paste', handlePaste);

  // 在组件卸载时移除监听器
  return () => {
    document.removeEventListener('paste', handlePaste);
  };
}

const DefaultJsonTemplate = {
  code: 200,
  data: {},
  message: "hello ya"
}

function App() {
  let apiPath = createRef()
  let delayMs = createRef()
  const [list, setList] = useState([])
  const [jsonData, setJsonData] = useState(DefaultJsonTemplate)
  const [globalMsg, setGlobalMsg] = useState('Paste json data here')
  useEffect(() => {
    initPasteEvent(setJsonData, setGlobalMsg)
  }, []);
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
    const res = await addMockData({
      path, data, delayMs
    })
    let jsonRes
    try {
      jsonRes = await res.json()
    } catch (err) {
      jsonRes = await res.text()
      console.log(err)
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

  return (
    <div className="App">
      <GlobalMessage message={globalMsg}></GlobalMessage>
      <Part width="auto" height="100vh">
        <LeftSide apiList={list} refresh={refresh}></LeftSide>
      </Part>
      <main className="main-part">
        <section className="mock-item">
          <div>
            <wired-input placeholder="api path" ref={apiPath}></wired-input>
          </div>
          <div>
            <wired-input placeholder="resp delay ms" ref={delayMs}></wired-input>
          </div>
          {/* <HTextarea placeholder="hello boy" value={data} ref={mockData} inputHandler={handler}></HTextarea> */}
          <ResBody
            jsonData={jsonData}
            setJsonData={setJsonData}
          ></ResBody>
          <div className="mock-item-btn-box">
            <div className="mock-item-btn">
              <wired-button className="mock-item-btn"
                onClick={async () => {
                  const res = await submit(apiPath.current.value, jsonData, delayMs.current.value)
                  if (res.code === 200) {
                    apiPath.current.value = ''
                    setJsonData({...DefaultJsonTemplate})
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
