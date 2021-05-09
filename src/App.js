import React, { Component, Fragment } from 'react';
import './App.css';
import socket from "./service/socket"
import Card from './component/card';
import Block from './component/block';

const { Blockchain, Transaction } = require("./module/blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      myCoin: new Blockchain,
      myKey: null,
      myWalletAddress: null,
    }
    socket.on("sync-block", (data) => {
      console.log(data);
      this.state.myCoin.chain = data.chain;
      this.state.myCoin.pendingTransactions = data.pendingTransactions
      this.setState({
        myCoin: this.state.myCoin
      })
    })
  }

  handleCreateWallet = () => {
    const key = ec.genKeyPair();
    this.setState({
      myWalletAddress: key.getPublic('hex'),
      myKey: key.getPrivate('hex')
    })
  }

  handleMining = () => {
    this.state.myCoin.minePendingTransactions(this.state.myWalletAddress);
    this.setState({
      myCoin: this.state.myCoin
    })
    socket.emit("update-db", {chain: this.state.myCoin.chain, pendingTransactions: this.state.myCoin.pendingTransactions})
  }

  handleSendMoney = (e) => {
    e.preventDefault();
    const wallet = document.getElementById("send-wallet").value;
    const amount = document.getElementById("send-amount").value;
    const tx = new Transaction(this.state.myWalletAddress, wallet, amount);
    tx.signTransaction(ec.keyFromPrivate(this.state.myKey));
    this.state.myCoin.addTransaction(tx);
    this.setState({
      myCoin: this.state.myCoin
    })
    socket.emit("update-db", {chain: this.state.myCoin.chain, pendingTransactions: this.state.myCoin.pendingTransactions})
  }

  render () {
    let i = 0;
    console.log(this.state.myCoin?.chain);
    return (
      <Fragment>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: 540, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 50}}>
          {!this.state.myKey || !this.state.myWalletAddress ?
          <button style={{width: 100, height: 40, background: "blue", border: "none", color: "white",  borderRadius: "2px"}} onClick={this.handleCreateWallet}>Create wallet</button>
          : <Card wallet={this.state.myWalletAddress} amount={this.state.myCoin.getBalanceOfAddress(this.state.myWalletAddress)} onSendMoney={this.handleSendMoney}></Card>}
          
        </div>
        <div style={{padding: "5px 30px", width: "800px"}}>
          <p><b>Transactions: </b><button disabled={this.state.myCoin?.pendingTransactions.length === 0} onClick={this.handleMining}>Mine</button></p>
          <table>
            <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {this.state.myCoin?.pendingTransactions.slice(0).reverse().map((transaction) => {
              i++;
              return (<tr key={i}>
                <td>#{i}</td>
                <td className="threedots">{transaction.fromAddress === this.state.myWalletAddress ? "(You)" : ""}{transaction.fromAddress}</td>
                <td className="threedots">{transaction.toAddress}</td>
                <td style={{color: 'green'}}>{transaction.amount}</td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                <span style={{color: 'red'}}>Pending</span>
              </tr>)
            })}
          {this.state.myCoin?.chain.slice(0).reverse().map((block) => {
              return block.transactions.slice(0).reverse().map(transaction  => {
                i++;
                return (<tr key={i}>
                  <td>#{i}</td>
                  <td className="threedots">{transaction.fromAddress}</td>
                  <td className="threedots">{transaction.toAddress}</td>
                  <td style={{color: 'green'}}>{transaction.amount}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                  <span style={{color: 'green'}}>Mined</span>
                </tr>)
              })})}
          </tbody>
          </table>
        </div>
      </div>
    </Fragment>
    );
  }
}

export default App;
