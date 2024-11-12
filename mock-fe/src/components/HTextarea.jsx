import React from 'react'
import './HTextarea.css'
import PropTypes from 'prop-types'

class HTextarea extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: '',
      isFocus: false
    }
  }

  inputHandler (event) {
    event.preventDefault()
    const value = event.target.innerText
    this.setState({
      content: value
    })
    // 更新props回调
    this.props.inputHandler && this.props.inputHandler(value, event, this)
  }

  render () {
    let isShowPlaceholder = !this.state.content
    // let isShowPlaceholder = !this.props.value
    return (
      <div className="textarea-outer">
        <wired-card>
          <div contentEditable="true" className="h-textarea" onInput={e => this.inputHandler(e)}>
          </div>
          {
            isShowPlaceholder ?
              ( <span className="placeholder">mock data here</span> ) : ''
          }
        </wired-card>
      </div>
    )
  }
}
HTextarea.propTypes = {
  inputHandler: PropTypes.func
}

export default HTextarea