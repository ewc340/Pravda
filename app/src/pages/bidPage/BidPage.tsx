import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, { PureComponent } from 'react';
import Countdown from 'react-countdown';
import Modal from 'react-modal';
import * as utils from 'utils';
import { LoaderComponent, LogoBar } from '../../components';
import './BidPage.css';


interface Props {
  id: string;
}

interface State {
  auctionInformation: AuctionInformation | undefined;
  accounts: string[];
  bidStatus: 'success' | 'idle' | 'fail';
  bidTransactionHash: string;
  bidAmount: number;
  proposedBid: number;
  web3: any;
  balance: number;
  senderAddress: string;
  timeExpiredModalIsOpen: boolean;
  winner: string;
}

interface AuctionInformation {
  name: string;
  beneficiary: string | undefined; // if undefined then either not beneficiary or visitor
  description: string;
  winner: string;
  expiresAt: any;
  bidAmount: number; 
  contractAddress: string;
  numBids: number;
}

const HIGHEST_BID = 2**256 - 1;

export class BidPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      senderAddress: '', 
      auctionInformation: undefined, 
      accounts: [], 
      bidStatus: 'idle', 
      bidTransactionHash: '', 
      bidAmount: HIGHEST_BID, 
      proposedBid: HIGHEST_BID,
      web3: undefined, 
      balance: 0,
      timeExpiredModalIsOpen: false,
      winner: ''
    };
  }

  async componentDidMount () {
    const { id } = this.props;
    const auctionInfoResponse = await utils.api.getAuctionInformation(id);
    if (auctionInfoResponse) {
      this.setState({ auctionInformation: auctionInfoResponse });
      
      // get the winner 
      if (auctionInfoResponse && Date.now() > auctionInfoResponse.expiresAt && auctionInfoResponse.winner === '') {
        const winner = await utils.api.endAuction(auctionInfoResponse.contractAddress);
        this.setState({ winner });
      } else if (auctionInfoResponse.winner != '')  { // winner already exists
        this.setState({ winner: auctionInfoResponse.winner });
      }
    }
    const web3: any = await utils.getGanacheWeb3();
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    if (accounts.length > 0) {
      this.setState({ accounts, web3, balance: web3.utils.fromWei(balance) });
    }
  }

  getBalance = async (senderAddress: string) => {
    const { web3 } = this.state;
    if (web3 && senderAddress !== '') {
      const balance = await web3.eth.getBalance(senderAddress);
      this.setState({ balance: web3.utils.fromWei(balance) });
    }
  }

  setTimeExpiredModal = () => {
    this.setState({ timeExpiredModalIsOpen: false });
  }

  bid = async (event: any) => {
    event.preventDefault();
    const { auctionInformation, proposedBid, web3, accounts, senderAddress } = this.state;
    const { id } = this.props;

    /* Check if time expired already */
    if (auctionInformation && Date.now() > auctionInformation.expiresAt) {
      this.setState({ timeExpiredModalIsOpen: true })
      return;
    }

    // submit bid to Auction smart contract instance
    if (auctionInformation && web3 && accounts.length > 0) {
      const contract = new web3.eth.Contract(JSON.parse(utils.contractABI()), auctionInformation.contractAddress);
      await contract.methods.bid().send({ from: senderAddress, value: proposedBid })
              .on('transactionHash', async (hash: string) => { 
                console.log('transaction was successful');

                // upload bid data to backend 
                const createBidResponse = await utils.api.createBid(id, senderAddress, proposedBid);
                console.log("response", createBidResponse);
                if (createBidResponse) {
                  console.log('set bid status to success');
                  this.setState({ bidStatus: 'success', bidTransactionHash: hash, bidAmount: proposedBid });
                }
                const auctionInfoResponse = await utils.api.getAuctionInformation(id);
                if (auctionInfoResponse) {
                  this.setState({ auctionInformation: auctionInfoResponse })
                }
              })
              .on('error', (_err: any) => this.setState({ bidStatus: 'fail' }));

    } else {
      this.setState({ bidStatus: 'fail' })
    }
  }

  onBidAmountChange = (event: any) => {
    const proposedBid = event.target.value;
    this.setState({ proposedBid });
  }

  onAddressSelectionChange = (event: any) => {
    const address = event.target.value;
    this.setState({ senderAddress: address });
    this.getBalance(address);
  }

  setBidStatusToIdle = () => {
    this.setState({ bidStatus: 'idle' });
  }
  render() {
    const { auctionInformation, bidAmount, senderAddress, accounts, balance, timeExpiredModalIsOpen, bidStatus, winner } = this.state;

    return (
      auctionInformation === undefined ? <LoaderComponent /> :
      <div className='main-bidding-container'>
        <LogoBar />
        <div className='main-bidPage-container'>
          <div className='bid-info-header'>
            <h1>{auctionInformation.name}</h1>
            {winner === '' ? <h1><Countdown date={auctionInformation.expiresAt} /></h1> : <h3>{`Winner: ${winner}`}</h3>}
          </div>
          <div className='bid-info-container'>
            <div className='bid-info-left'>
              <h1>Auction Information</h1>
              <p style={{ textAlign: 'center', marginTop: '15px' }}>This is some really nice information about this auction. This product/service is amazing and I would advise anyone to try it out.</p>
              <h1 style={{ textAlign: 'center', marginTop: '15px' }}>Additional Information</h1>
              <p style={{ textAlign: 'center', marginTop: '15px' }}>{auctionInformation.description}</p>
            </div>
            <div className='bid-info-right'>
              <h3 style={{ padding: '10px' }}>Bids: {auctionInformation.numBids} </h3>
              <h3 style={{ padding: '10px' }}>Beneficiary: {auctionInformation.beneficiary} </h3>
              {accounts.length > 0 ? <h3 style={{ padding: '10px' }}>Balance: {balance} Ether</h3> : null}
              <h3 style={{ padding: '10px' }}>Current Bid: {bidAmount == HIGHEST_BID ? 'Bid the lowest bid below!' : bidAmount} </h3>
              <h3 style={{ padding: '10px' }}>Select a sender address: </h3>
              <FormControl style={{ padding: '10px' }}>
                <Select
                  value={senderAddress}
                  onChange={this.onAddressSelectionChange}
                >
                  {accounts.map((account: string) => {
                    if (account !== auctionInformation.beneficiary) {
                      return <MenuItem value={account}>{account}</MenuItem>
                    }
                  })}
                </Select>
              </FormControl>
            </div>
          </div>

          <div style={{ marginBottom: '10px', padding: '10px', }}>
            <TextField
              id="standard-number"
              label="Input Bid"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
              onChange={this.onBidAmountChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.bid}
              size="large"
              style={{ fontSize: '22px' }}
            >
              Send Bid
            </Button>
          </div>
          <Modal isOpen={timeExpiredModalIsOpen} style={customModalStyle}>
            <div className='time-expired-modal-container'>
              <h1>The auction has already ended.</h1>
              <Button
                variant="outlined"
                color="secondary"
                onClick={this.setTimeExpiredModal}
                size="small"
                style={{ width: '20%' }}
              >
                OK
              </Button>
            </div>
          </Modal>
          <Modal isOpen={bidStatus === 'success'} style={customModalStyle}>
            <div className='time-expired-modal-container'>
              <h1>Your transaction was successful!</h1>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.setBidStatusToIdle}
                size="small"
                style={{ color: 'white', backgroundColor: 'green' }}
              >
                OK
              </Button>
            </div>
          </Modal>
          <Modal isOpen={bidStatus === 'fail'} style={customModalStyle}>
            <div className='time-expired-modal-container'>
              <h2 style={{ textAlign: 'center' }}>An error occurred. Either you did not have the lowest bid or we could not accept your transaction.</h2>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.setBidStatusToIdle}
                size="small"
                style={{ color: 'white' }}
              >
                OK
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

const customModalStyle = {
  content: {
    width: '40%',
    height: '30%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};