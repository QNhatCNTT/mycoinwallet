import React, {Component} from "react"

export default class Block extends Component {

  constructor(props) {
    super(props)
  }
  render () {
    return (
      <div className="block">
        <p>Previous hash {this.props.block.previousHash}</p>
        <p>Hash {this.props.block.hash}</p>
        <p>Nonce {this.props.block.nonce}</p>
        <p>Time {new Date(this.props.block.timestamp).toLocaleString()}</p>
      </div>
    )}
}