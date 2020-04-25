import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import history from '../../browserHistorySetup';
import { AnimatedPlus, LogoBar } from '../../components';
import * as utils from '../../utils';
import './AddAuctionItem.css';

interface Props {
  beneficiary: string;
}

interface State {
  modalIsOpen: boolean;
  formItemName: string;
  formItemDescription: string;
  formBidTime: number;
}

interface PostNewAuctionResponse {
  contractAddress: string;
  auctionId: string;
}

export class AddAuctionItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { modalIsOpen: false, formItemName: '', formItemDescription: '', formBidTime: 0 };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  onFormSubmit = async (e) => {
    e.preventDefault();
    const { formItemName, formItemDescription, formBidTime } = this.state;
    const response: PostNewAuctionResponse = await utils.api.postNewAuction(formItemName, formItemDescription, formBidTime, this.props.beneficiary);
    if (response) {
      history.push(`/auction/${response.auctionId}`)
    }
    console.log(response);
  }

  changeHandler = (event: any) => {
    const eventName = event.target.name;
    const value = event.target.value;
    if (eventName === 'itemName') {
      // validate item name
      this.setState({ formItemName: value });
    } else if (eventName === 'itemDescription') {
      this.setState({ formItemDescription: value });
    } else if (eventName === 'itemBidTime') {
      this.setState({ formBidTime: value });
    }
  }

  render() {
    const { modalIsOpen, formItemDescription, formItemName, formBidTime } = this.state;

    return (
      <div>
        <LogoBar />
        <div className='main-addAuctionItem-container'>
          <h1>Have something to bid?</h1>
          <div className='add-new-item-container' onClick={this.openModal}>
            <AnimatedPlus />
            <p>Add Item</p>
          </div>
          <br />
          <h1>See live ongoing auctions here!</h1>
        </div>
        <Modal isOpen={modalIsOpen} style={customModalStyle}>
          <div className='add-auction-item-header'>
            <h1>Add Auction Item</h1>
            <button onClick={this.closeModal}>Close</button>
          </div>
          <div className='add-auction-item-form-container'>
            <form className='auction-item-form'>
              <label>
                Item name:
                <input type='text' name='itemName' value={formItemName} onChange={this.changeHandler} />
              </label>
              <label>
                Item description:
                <input type='text' name='itemDescription' value={formItemDescription} onChange={this.changeHandler} />
              </label>
              <label>
                Bid time:
                <input type='number' name='itemBidTime' value={formBidTime} onChange={this.changeHandler} />
              </label>
              <button onClick={this.onFormSubmit}>Submit Auction</button>
            </form>
          </div>
        </Modal>
      </div>
    )
  }
}

// private styles
const customModalStyle = {
  content: {
    width: '50%',
    height: '60%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};