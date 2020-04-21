/* This component gives credit to https://www.florin-pop.com/blog/2019/05/countdown-built-with-react/ */

import React from 'react';
import moment from 'moment';
import './CountdownTimer.css';

interface Props {
  timeTillDate: string;
  timeFormat: string;
}

interface State {
  days: string | undefined;
  hours: string | undefined;
  minutes: string | undefined;
  seconds: string | undefined
}

interface SVGCircleProps {
  radius: number;
}

export class CountdownTimer extends React.Component<Props, State> {
  interval!: NodeJS.Timeout;
    
    constructor(props: Props) {
      super(props);
      this.state = {
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined
      };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const { timeTillDate, timeFormat } = this.props;
            const futureTime = moment(timeTillDate, timeFormat);
            const now = moment().format(timeFormat);
            const countdown = moment(futureTime.diff(now));
            const days = countdown.format('D');
            const hours = countdown.format('HH');
            const minutes = countdown.format('mm');
            const seconds = countdown.format('ss');

            this.setState({ days, hours, minutes, seconds });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        const { days, hours, minutes, seconds } = this.state;

        // Mapping the date values to radius values
        const daysRadius = mapNumber(Number(days), 30, 0, 0, 360);
        const hoursRadius = mapNumber(Number(hours), 24, 0, 0, 360);
        const minutesRadius = mapNumber(Number(minutes), 60, 0, 0, 360);
        const secondsRadius = mapNumber(Number(seconds), 60, 0, 0, 360);

        if (!seconds) {
            return null;
        }

        return (
            <div>
                <div className="countdown-wrapper">
                    {days && (
                        <div className="countdown-item">
                            <SVGCircle radius={daysRadius} />
                            {days}
                            <span>days</span>
                        </div>
                    )}
                    {hours && (
                        <div className="countdown-item">
                            <SVGCircle radius={hoursRadius} />
                            {hours}
                            <span>hours</span>
                        </div>
                    )}
                    {minutes && (
                        <div className="countdown-item">
                            <SVGCircle radius={minutesRadius} />
                            {minutes}
                            <span>minutes</span>
                        </div>
                    )}
                    {seconds && (
                        <div className="countdown-item">
                            <SVGCircle radius={secondsRadius} />
                            {seconds}
                            <span>seconds</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const SVGCircle = ({ radius }: SVGCircleProps) => (
    <svg className="countdown-svg">
        <path
            fill="none"
            stroke="#333"
            stroke-width="4"
            d={describeArc(50, 50, 48, 0, radius)}
        />
    </svg>
);

// From StackOverflow: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    var d = [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y
    ].join(' ');

    return d;
}

// From StackOverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function mapNumber(number: number, in_min: number, in_max: number, out_min: number, out_max: number) {
    return (
        ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
}