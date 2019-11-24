import React from 'react'
import { useState, createRef } from 'react'
import './leftSide.css'
import swal from 'sweetalert'

/**
 * 把json改成高亮
 * @param {string} json
 */
function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  });
}

const LeftSide = ({apiList = [], refresh = () => {}}) => {
  // done todo 点击api名, 弹出dialog 显示response
  const [isShow, setIsShow] = useState(false)
  const [responseText, setResponseText] = useState('')
  const myProps = isShow ? { open: true } : {}
  const showDialog = async (api) => {
    setIsShow(true)
    setResponseText("Loading...")
    let res = await fetch('..' + api)
    try {
      res = await res.json()
    } catch(e) {
      res = await res.text()
    }
    res = JSON.stringify(res, null, 2)
    res = syntaxHighlight(res) // 高亮
    setResponseText(res)

  }
  const hideDialog = () => {
    setIsShow(false)
  }

  const delMockData = async (e, api) => {
    e.stopPropagation()
    let res = await fetch('../delMockData', {
      method: 'POST',
      body: JSON.stringify({
        path: api
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    res = await res.json()
    if (res.code === 200 && res.data) {
      refresh()
      swal('Delete Success', 'ok', 'success')

    } else {
      swal('Delete Failed', res.msg || 'No msg..', 'error')
    }
  }
  let list = (
    <ul className="left-side">
      {
        apiList.map((api, index) => (
          <li key={index} onClick={e => showDialog(api.path)}>
            <span role="img" aria-label="each-api" className="emoji bone">🦴</span>
            <span role="img" aria-label="each-api" className="emoji face">🤩 </span>
            <span>
              {api.path}
            </span>
            <strong className="del-path" onClick={e => delMockData(e, api.path)}>x</strong>
          </li>
        ))
      }
    </ul>
  )
  let noList = 'no list'
  return (
    <div>
      {apiList.length ? list : noList}
      <wired-dialog { ...myProps }>
        <div className="res-dialog-box">
          <wired-button onClick={hideDialog}>Close</wired-button>
          <div>
            <pre
              dangerouslySetInnerHTML={{ __html: responseText}}
            >
            </pre>
          </div>
        </div>
      </wired-dialog>
    </div>
  )
}

export default LeftSide