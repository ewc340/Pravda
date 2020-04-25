// import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import React, { Component } from 'react';

interface Props {
  timeTillDate: string;
}

interface State {
  totalDuration: string;
}

export class CountdownTimer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    //initialize the counter duration
    this.state = {
      totalDuration: '',
    };
  }

  componentDidMount() {
    var that = this;

    var date = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD hh:mm:ss');
    
    var expirydate = '2020-04-21 04:00:45';

    var diffr = moment.duration(moment(expirydate).diff(moment(date)));

    var hours = diffr.asHours();
    var minutes = diffr.minutes();
    var seconds = diffr.seconds();
    
    var d = String(hours * 60 * 60 + minutes * 60 + seconds);
    //converting in seconds

    that.setState({ totalDuration: d });
    //Settign up the duration of countdown in seconds to re-render
  }

  render() {
    return (
      <div style={{ flex: 1, justifyContent: 'center' }}>
        {/* <CountDown
          until={this.state.totalDuration}
          onFinish={() => alert('finished')}
          onPress={() => alert('hello')}
          size={20}
        /> */}
      </div>
    );
  }
}
