import React, { Component } from 'react';
import { AddAuctionItem } from './pages';
import * as utils from './utils';

interface State {
  accounts: string[];
}

export class App extends Component<{}, State> {
  state = { accounts: []}
  componentDidMount = async () => {
    const web3: any = await utils.getGanacheWeb3();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      this.setState({ accounts });
    }
  }

  render() {
    return (
      <div>
        <AddAuctionItem beneficiary={this.state.accounts[0]} />
      </div>
    );
  }
}
