import React, { PureComponent } from 'react';
import { CountdownTimer, LogoBar } from '../../components';
import './BidPage.css';

interface Props {

}

interface State {

}

export class BidPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <LogoBar />
        <div className='main-container'>
          <div className='image-container'>
            <img src={require('assets/computers.jpg')} width={'50%'} />
          </div>
          <div className='bid-info-container'>
            <h1>Item name</h1>
            <div className='item-info'>
              <p>Price</p>
              <p>Quantity</p>
            </div>
            <CountdownTimer timeTillDate="04 22 2020 04:00:45" timeFormat="MM DD YYYY hh:mm:ss " />
          </div>
        </div>
      </div>
    )
  }
}