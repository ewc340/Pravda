import React, { Component } from 'react';
import * as utils from './utils';
import { BidPage } from 'pages';

export class App extends Component {
  componentDidMount = async () => {
    await utils.getWeb3();
  }

  render() {
    return (
      <div>
        <BidPage />
      </div>
    );
  }
}
