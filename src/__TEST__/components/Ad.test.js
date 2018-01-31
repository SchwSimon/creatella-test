import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Ad } from '../../components/Ad';

Enzyme.configure({ adapter: new Adapter() });

describe('<Ad />', () => {
  const genAdsQueryValueSpy = sinon.spy();
  const props = {
    queryKeyValues: [],
    genAdsQueryValue: genAdsQueryValueSpy
  };
  const mathRandomStub = sinon.stub(Math, 'random').returns('aaaaaaaaa');
  const adKey = 'aaaaaaa';  // Math.radom().toString(36).substr(2, 9)
  const wrapper = shallow(<Ad {...props} />);
  const defaultState = {...wrapper.state()};

  mathRandomStub.restore();

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('Default state', () => {
    expect(defaultState).toEqual({
      adKey: adKey,
      source: null
    });
  });

  describe('Lifecycle', () => {
    describe('constructor()', () => {
      it('must call genAdsQueryValueSpy with the generated adKey', () => {
        expect(genAdsQueryValueSpy.calledWith(adKey)).toBeTruthy();
      });
    });

    describe('componentWillReceiveProps()', () => {
      it('must set state.source', () => {
        const nextProps = {queryKeyValues: {[adKey]: 'VALUE'}};
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(wrapper.state().source).toBe('VALUE');
      });
    });

    describe('shouldComponentUpdate()', () => {
      it('must return true', () => {
        wrapper.state().source = null;
        expect(wrapper.instance().shouldComponentUpdate(undefined, {source: true})).toBe(true);
      });

      it('must return false', () => {
        wrapper.state().source = null;
        expect(wrapper.instance().shouldComponentUpdate(undefined, {source: null})).toBe(false);
      });

      it('must return false', () => {
        wrapper.state().source = true;
        expect(wrapper.instance().shouldComponentUpdate()).toBe(false);
      });
    });
  });
});
