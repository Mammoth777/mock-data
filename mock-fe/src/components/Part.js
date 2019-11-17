import React from 'react'
import './part.css'

export default class Part extends React.Component {
  render () {
    return (
      <section className="part-outer" style={{width: this.props.width, height: this.props.height}}>
        <wired-card>
          <div className="part-inner" style={{width: this.props.width, height: `calc(${this.props.height} - 20px)`}}>
            {this.props.children || 'part slot here'}
          </div>
        </wired-card>
      </section>
    )
  }
}
