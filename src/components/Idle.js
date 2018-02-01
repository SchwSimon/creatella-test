import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export const TRACK_EVENTS = [
  'scroll',
  'keydown',
  'mousedown',
  'mousemove',
  'touchstart'
];
export const IDLE_TIME = 8;  // in seconds

class Idle extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isIdle: false,
      lastAction: null,
      idleTimeout: null,
      idleTime: props.idleTime || IDLE_TIME
    };

    this.triggerEvent = this.triggerEvent.bind(this);
    this.setIdle = this.setIdle.bind(this);
  }

    // bind the track events
  componentDidMount() {
    TRACK_EVENTS.forEach(event => {
      window.addEventListener(event, this.triggerEvent, false);
    });
  }

    // unbind the track events
  componentWillUnmount() {
    TRACK_EVENTS.forEach(event => {
      window.removeEventListener(event, this.triggerEvent, false)
    })
  }

    // track event trigger
  triggerEvent() {
      // throttle the busy setter action to maximum 1 time per second
    if (this.state.lastAction
      && Date.now() - this.state.lastAction < 1000)
      return;

    this.setBusy();
  }

    // sets the client to be busy
  setBusy() {
    this.setState(prevState => {
      if (prevState.idleTimeout)
        clearTimeout(prevState.idleTimeout);

      if (prevState.isIdle !== false)
        this.onIdleChange(false);

      return {
        lastAction: Date.now(),
        isIdle: false,
        idleTimeout: setTimeout(this.setIdle, prevState.idleTime * 1000)
      }
    });
  }

    // sets the client to be idle
  setIdle() {
    this.setState({isIdle: true}, () => this.onIdleChange(true));
  }

    // on idle status change
  onIdleChange(isIdle) {
    this.props.onIdleChange(isIdle);
  }

  render() {
    return null;
  }
}

Idle.propTypes = {
  idleTime: PropTypes.number,
  onIdleChange: PropTypes.func.isRequired,
}

export default Idle;
