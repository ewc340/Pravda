import React, { Component } from 'react';
import { AddAuctionItem } from './pages';
import * as utils from './utils';

interface State {
  accounts: string[];
}

export class App extends Component<{}, State> {
  state = { accounts: []}
  componentDidMount = async () => {
    const web3: any = await utils.getWeb3();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      this.setState({ accounts });
    }
    console.log(accounts);
    let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]) : web3.utils.toWei('0');
    // const contract = new web3.eth.Contract(JSON.parse(utils.contractABI()), '0x3DA9c4916C2007968d6748AC191e3B338d71571a');
    // await contract.methods.bid().send({ from: accounts[0], value: 100000 }).catch((err: any) => {
    //   console.log(err);
    // });
  }

  render() {
    return (
      <div>
        <AddAuctionItem beneficiary={this.state.accounts[0]} />
      </div>
    );
  }
}
