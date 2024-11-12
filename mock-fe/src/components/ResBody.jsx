import { JsonEditor } from 'json-edit-react'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const placeholder = `{
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

ResBody.propTypes = {
  jsonData: PropTypes.object,
  setJsonData: PropTypes.func
}

export default function ResBody({ jsonData, setJsonData }) {
  const [showTip, setShowTip] = useState(false);
  const otherProps = {
    enableClipboard: true,
    theme: 'githubLight',
    rootName: 'Mock Response'
  }
  const toggleRef = useRef(null);
  useEffect(() => {
    toggleRef.current.addEventListener('change', (evt) => {
      setShowTip(evt.detail.checked);
    });
  })
  return (
    <div>
      {/* <wired-textarea placeholder={placeholder} ref={mockData} rows="20" data-className="mock-data"></wired-textarea> */}
      <wired-card>
        <JsonEditor
          data={ jsonData }
          setData={ setJsonData } // optional
          { ...otherProps } />
      </wired-card>
      <div style={{position: 'relative'}}>
        <div>
          <wired-checkbox ref={toggleRef}>show tip</wired-checkbox>
        </div>
        <div style={{position: 'absolute'}}>
          {showTip && (
            <wired-card>
              <code>
                <pre style={{outline: 'none', color: '#666'}}>
                  提示: (可直接CV到当前页，自动生成响应体) <br/>
                  {placeholder}
                </pre>
              </code>
            </wired-card>
          )}
        </div>
      </div>
    </div>
  )
}
