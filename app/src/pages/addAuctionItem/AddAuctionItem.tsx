import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import history from '../../browserHistorySetup';
import { AnimatedPlus, LogoBar, NestedGrid } from '../../components';
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
  data: any[];
}

interface DataEntry {
  itemName: string;
  id: string;
}

interface PostNewAuctionResponse {
  contractAddress: string;
  auctionId: string;
}

export class AddAuctionItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { modalIsOpen: false, formItemName: '', formItemDescription: '', formBidTime: 0, data: [] };
  }

  async componentDidMount() {
    const bidData = await utils.api.getAllBids();
    const buildNameAndIdArray: DataEntry[] = []
    if (bidData) {
      console.log(bidData.length);
      bidData.map((bidDatum: any) => {
        const data: DataEntry = { itemName: bidDatum.name, id: bidDatum.id };
        buildNameAndIdArray.push(data);
      })
      this.setState({ data: buildNameAndIdArray });
    }
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
    const eventName = event.target.id;
    const value = event.target.value;
    if (eventName === 'itemName') {
      this.setState({ formItemName: value });
    } else if (eventName === 'itemDescription') {
      this.setState({ formItemDescription: value });
    } else if (eventName === 'itemBidTime') {
      this.setState({ formBidTime: value });
    }
  }

  dateOnChange = (date: any) => {
    const toSeconds = date.hour() * 3600 + date.minute() * 60 + date.seconds();
    this.setState({ formBidTime: toSeconds });
  }

  render() {
    const { modalIsOpen, formItemDescription, formItemName, formBidTime, data } = this.state;

    return (
      <div>
        <LogoBar />
        <div className='main-addAuctionItem-container'>
          <h1 style={{ marginTop: '10px' }}>Have something you want procured?</h1>
          <div className='add-new-item-container' onClick={this.openModal}>
            <AnimatedPlus />
            <p>Add Item</p>
          </div>
          <br />
          <h1 style={{ marginTop: '10px' }}>See live auctions below!</h1>
          {data.length > 0 ? <NestedGrid data={data}/> : null}
        </div>
        <Modal isOpen={modalIsOpen} style={customModalStyle}>
          <div className='modal-container'>
            <div className='add-auction-item-header'>
              <h1 style={{ marginRight: '30%' }}>Add Auction Item</h1>
              <HighlightOffOutlinedIcon onClick={this.closeModal} fontSize='large' />
            </div>
            <div className='add-auction-item-form-container'>
              <TextField
                id='itemName'
                label="Item name"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formItemName}
                onChange={this.changeHandler}
                variant='outlined'
                style={{ marginTop: '5px', width: '60%' }}
              />
              <TextField
                id='itemDescription'
                label="Item description"
                InputLabelProps={{
                  shrink: true,
                }}
                multiline
                rows="4"
                onChange={this.changeHandler}
                variant='outlined'
                style={{ marginTop: '10px', width: '60%' }}
              />
              <h4 style={{ margin: '0px', padding: 0 }}>Select bid time: </h4>
              <TimePicker onChange={this.dateOnChange}/>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onFormSubmit}
                size="small"
                style={{ color: 'white' }}
              >
                Submit Auction
              </Button>
            </div>
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

