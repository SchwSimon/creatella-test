import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Idle, { TRACK_EVENTS, IDLE_TIME } from '../../components/Idle';

Enzyme.configure({ adapter: new Adapter() });

describe('Constants', () => {
  it('TRACK_EVENTS', () => {
    expect(TRACK_EVENTS).toEqual([
      'scroll',
      'keydown',
      'mousedown',
      'mousemove',
      'touchstart'
    ]);
  });

  it('IDLE_TIME', () => {
    expect(IDLE_TIME).toBe(8);
  });
});

describe('<Idle />', () => {
  const onIdleChangeSpy = sinon.spy();
  const props = {
    onIdleChange: onIdleChangeSpy
  };
  const wrapper = shallow(<Idle {...props} />);
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('Default state', () => {
    expect(defaultState).toEqual({
      isIdle: false,
      lastAction: null,
      idleTimeout: null,
      idleTime: IDLE_TIME
    });
  });

  describe('Lifecycle', () => {
    describe('componentDidMount()', () => {
      it('must bind all events in TRACK_EVENTS to the window', () => {
        const addEventListenerStub = sinon.stub(window, 'addEventListener');
        wrapper.instance().componentDidMount();
        addEventListenerStub.restore();

        let eventsBinded = 0;
        TRACK_EVENTS.forEach(event => {
          if (addEventListenerStub.calledWith(event, wrapper.instance().triggerEvent, false))
            eventsBinded++;
        });
        expect(eventsBinded).toBe(TRACK_EVENTS.length);
      });
    });

    describe('componentWillUnmount()', () => {
      it('must unbind all events in TRACK_EVENTS from the window', () => {
        const removeEventListenerStub = sinon.stub(window, 'removeEventListener');
        wrapper.instance().componentWillUnmount();
        removeEventListenerStub.restore();

        let eventsUnbinded = 0;
        TRACK_EVENTS.forEach(event => {
          if (removeEventListenerStub.calledWith(event, wrapper.instance().triggerEvent, false))
            eventsUnbinded++;
        });
        expect(eventsUnbinded).toBe(TRACK_EVENTS.length);
      });
    });
  });

  describe('triggerEvent()', () => {
    it('must call setBusy() twice', () => {
      const setBusyStub = sinon.stub(wrapper.instance(), 'setBusy');

      wrapper.instance().triggerEvent();
      wrapper.state().lastAction = Date.now();
      wrapper.instance().triggerEvent();
      wrapper.state().lastAction = Date.now() - 1001;
      wrapper.instance().triggerEvent();

      setBusyStub.restore();

      expect(setBusyStub.callCount).toBe(2);
    });
  });

  describe('setBusy()', () => {
    const setTimeoutStub = sinon.stub(window, 'setTimeout').returns('TIMEOUT');
    beforeEach(() => {
      wrapper.state().isIdle = true;
    });
    afterAll(() => {
      setTimeoutStub.restore();
    });

    it('must call onIdleChange(false)', () => {
      const onIdleChangeStub = sinon.stub(wrapper.instance(), 'onIdleChange');
      wrapper.instance().setBusy();
      onIdleChangeStub.restore();
      expect(onIdleChangeStub.calledWith(false)).toBeTruthy();
    });

    it('must set the correct state props', () => {
      const dateNowStub = sinon.stub(Date, 'now').returns('NOW');
      wrapper.instance().setBusy();
      dateNowStub.restore();

      expect(wrapper.state()).toMatchObject({
        lastAction: 'NOW',
        isIdle: false,
        idleTimeout: 'TIMEOUT'
      });
    });

    it('must call setTimeout with the correct args', () => {
      expect(setTimeoutStub.calledWith(wrapper.instance().setIdle, wrapper.state().idleTime * 1000)).toBeTruthy();
    });
  });

  describe('setIdle()', () => {
    const onIdleChangeStub = sinon.stub(wrapper.instance(), 'onIdleChange');
    wrapper.state().isIdle = false;
    wrapper.instance().setIdle();
    const isIdle = wrapper.state().isIdle;
    onIdleChangeStub.restore();

    it('must set the state.isIdle to true', () => {
      expect(isIdle).toBe(true);
    });

    it('must call onIdleChange', () => {
      expect(onIdleChangeStub.calledWith(true)).toBeTruthy();
    });
  });

  describe('onIdleChange()', () => {
    it('must call props.onIdleChange with the @param isIdle', () => {
      wrapper.instance().onIdleChange('IS_IDLE');
      expect(onIdleChangeSpy.calledWith('IS_IDLE')).toBeTruthy();
    });
  });
});
