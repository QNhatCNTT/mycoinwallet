import React, {Component} from "react"

export default class Card extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (<div className="info-card">
      <span className='card-wallet'>My Wallet Address </span><p className="wallet-address">{this.props.wallet}</p>
      <p className="balance">Balance: {this.props.amount} MC</p>
      <form onSubmit={this.props.onSendMoney} className="send-form">
        <div>
          <label htmlFor="send-wallet">Send to: </label>
          <input type="text" placeholder="wallet address" id="send-wallet" required/>
        </div>
        <div>
          <label htmlFor="send-amount">Amount: </label>
          <input type="number" id="send-amount" max={this.props.amount} required/>
        </div>
        <button type="submit">Send</button>
      </form>
    </div>)
  }
}