import React, { PureComponent } from 'react';
import { useParams } from "react-router-dom";
import { /* CountdownTimer, */ LoaderComponent, LogoBar } from '../../components';
import './BidPage.css';
import * as utils from 'utils';

interface Props {
  id: string;
}

interface State {
  auctionInformation: AuctionInformation | undefined;
  accounts: string[];
  bidStatus: 'success' | 'idle' | 'fail';
  bidTransactionHash: string;
  bidAmount: number;
}

interface AuctionInformation {
  name: string;
  beneficiary: string | undefined; // if undefined then either not beneficiary or visitor
  description: string;
  winner: string;
  expiresAt: any;
  bidAmount: number; // if -1 then either visitor, have not bidded, or beneficiary - should not be able to bid
  contractAddress: string;
}

// bidAmount should be > -1

const HIGHEST_BID = 2**256 - 1;

export class BidPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { auctionInformation: undefined, accounts: [], bidStatus: 'idle', bidTransactionHash: '', bidAmount: 3204234 };
  }

  async componentDidMount () {
    const { id } = this.props;
    const auctionInfoResponse = await utils.api.getAuctionInformation(id);
    if (auctionInfoResponse) {
      this.setState({ auctionInformation: auctionInfoResponse })
    }

  }

  bid = async (event: any) => {
    // check for sender address
    event.preventDefault();
    const { auctionInformation, bidAmount } = this.state;
    const { id } = this.props;

    const web3: any = await utils.getWeb3();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      this.setState({ accounts });
    }
    console.log(accounts);

    if (auctionInformation) {
      const contract = new web3.eth.Contract(JSON.parse(utils.contractABI()), auctionInformation.contractAddress);
      await contract.methods.bid().send({ from: '0x07eF057F32b590a7D00F8Bb788BFE997321CAa83', value: bidAmount })
              .on('transactionHash', async (hash: string) => { 
                console.log('transaction was successful');

                // upload bid data to backend 
                const createBidResponse = await utils.api.createBid(id, accounts[0], bidAmount);
                if (createBidResponse) {
                  this.setState({ bidStatus: 'success', bidTransactionHash: hash });
                }
              })
              .on('error', (_err: any) => this.setState({ bidStatus: 'fail' }));

    } else {
      // need to show error message here
      alert('bid failure');
    }
  }

  onBidAmountChange = (event: any) => {
    const bidAmount = event.target.value;
    this.setState({ bidAmount });
  }

  render() {
    const { auctionInformation, bidAmount } = this.state;
    return (
      auctionInformation === undefined ? <LoaderComponent /> :
      <div>
        <LogoBar />
        <div className='main-bidPage-container'>
          <div className='bidPage-image-container'>
            <img src={require('assets/computers.jpg')} width={'50%'} />
          </div>
          <div className='bid-info-container'>
            <h1>{auctionInformation.name}</h1>
            <div className='bidItem-info'>
              {auctionInformation.bidAmount > -1 ? 
                (
                  <p>Current bid: { auctionInformation.bidAmount }</p>
                ) : 
                (
                  <div>
                    <input type='text' name='bidAmount' value={bidAmount} onChange={this.onBidAmountChange} />
                    <button onClick={this.bid}>Bid!</button>
                  </div>
                )
              }
            </div>
            {/* <CountdownTimer timeTillDate="04 22 2020 04:00:45" timeFormat="MM DD YYYY hh:mm:ss " /> */}
          </div>
        </div>
      </div>
    )
  }
}