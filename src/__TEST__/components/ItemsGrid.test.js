import React from 'react';
import sinon from 'sinon';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ItemsGrid from '../../components/ItemsGrid';

Enzyme.configure({ adapter: new Adapter() });

describe('<ItemsGrid />', () => {
  const itemsSortFuncSpy = sinon.spy(a => a);
  const fetchItemsCallbackSpy = sinon.spy(a => [1,2,3]);
  const props = {
    fetchPage: 5,
    fetchLimit: 10,
    fetchSort: 'sort',
    itemsSortTypes: [1, 2, 3],
    itemsSortFunc: itemsSortFuncSpy,
    fetchItemsCallback: fetchItemsCallbackSpy,
    enableSpecialItems: true,
    specialItemEvery: 33,
    fetchLimitInitial: 33
  };
  const wrapper = shallow(<ItemsGrid {...props} />);
  const defaultState = {...wrapper.state()};

  it('renders without crashing', () => {
    expect(wrapper.length).toBe(1);
  });

  it('Default state', () => {
    expect(defaultState).toEqual({
      requestParams: {
        page: props.fetchPage,
        limit: props.fetchLimit,
        sort: props.fetchSort
      },
      itemsCache: [],
      itemsDisplayed: [],
      itemsSortTypes: props.itemsSortTypes,
      itemsSortFunc: props.itemsSortFunc,
      fetchCount: 0,
      isFetching: false,
      isEndOfItems: false,
      specialItemEnabled: props.enableSpecialItems,
      specialItemEvery: props.specialItemEvery,
    });
  });

  describe('Lifecycle', () => {
    describe('shouldComponentUpdate()', () => {
      let nextState;
      beforeEach(() => {
        nextState = {
          isFetching: wrapper.state().isFetching,
          isEndOfItems: wrapper.state().isEndOfItems,
          requestParams: {...wrapper.state().requestParams},
          itemsDisplayed: [...wrapper.state().itemsDisplayed]
        };
      });

      it('must return true', () => {
        nextState.isFetching = !props.isFetching;
        expect(wrapper.instance().shouldComponentUpdate(null, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextState.isEndOfItems = !props.isEndOfItems;
        expect(wrapper.instance().shouldComponentUpdate(null, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextState.requestParams.sort = '';
        expect(wrapper.instance().shouldComponentUpdate(null, nextState)).toBe(true);
      });

      it('must return true', () => {
        nextState.itemsDisplayed = {length: 1000};
        expect(wrapper.instance().shouldComponentUpdate(null, nextState)).toBe(true);
      });

      it('must return false', () => {
        expect(wrapper.instance().shouldComponentUpdate(null, nextState)).toBe(false);
      });
    });
  });

  describe('onLoadmore()', () => {
    const pushDisplayedItemsStub = sinon.stub(wrapper.instance(), 'pushDisplayedItems');
    const getItemsStub = sinon.stub(wrapper.instance(), 'getItems');
    wrapper.state().itemsCache = [1,2,3];
    wrapper.instance().onLoadmore();
    pushDisplayedItemsStub.restore();
    getItemsStub.restore();

    it('must call pushDisplayedItems()', () => {
      expect(pushDisplayedItemsStub.called).toBeTruthy();
    });

    it('must call getItems()', () => {
      expect(getItemsStub.called).toBeTruthy();
    });
  });

  describe('pushDisplayedItems()', () => {
    wrapper.state().itemsDisplayed = [{id:1}, {id:2}, {id:3}];
    wrapper.state().itemsCache = [{id:4}, {id:5}, {id:6}];
    const newItemsDisplayed = [{id:1}, {id:2}, {id:3}, {id:4}, {id:5}, {id:6}];
    wrapper.instance().pushDisplayedItems();

    it('must push the state.itemsDisplayed correct', () => {
      expect(wrapper.state().itemsDisplayed).toEqual(newItemsDisplayed);
    });

    it('must call state.itemsSortFunc with the concatenated state.itemsDisplayed', () => {
      expect(itemsSortFuncSpy.calledWith(newItemsDisplayed)).toBeTruthy();
    });
  });

  describe('async getItems()', () => {
    it('must set the correct state params', (done) => {
      const state = {...wrapper.state()};
      wrapper.instance().getItems();

      setTimeout(() => {
        expect(wrapper.state()).toMatchObject({
          requestParams: {
            ...state.requestParams,
            page: state.requestParams.page + 1
          },
          isFetching: false,
          itemsCache: state.itemsCache.concat(fetchItemsCallbackSpy()),
          isEndOfItems: false
        });
        done();
      }, 100)
    });

    describe('state.fetchCount = 0', () => {
      it('must call props.fetchItemsCallback with params', () => {
        wrapper.state().fetchCount = 0;
        const params = wrapper.state().requestParams;
        params.limit = props.fetchLimitInitial;
        wrapper.instance().getItems();

        expect(fetchItemsCallbackSpy.calledWith(params)).toBeTruthy();
      });
    });

    describe('state.fetchCount > 0', () => {
      it('must call props.fetchItemsCallback with params', () => {
        wrapper.state().fetchCount = 5;
        const params = wrapper.state().requestParams;
        wrapper.instance().getItems();

        expect(fetchItemsCallbackSpy.calledWith(params)).toBeTruthy();
      });
    });
  });

  describe('onIdle()', () => {
    const getItemsStub = sinon.stub(wrapper.instance(), 'getItems');
    wrapper.instance().onIdle(true);
    getItemsStub.restore();

    it('must call getItems()', () => {
      expect(getItemsStub.called).toBeTruthy();
    });
  });

  describe('onSort()', () => {
    const oldState = {...wrapper.state()};
    wrapper.instance().onSort({target: {value: 'SORT'}});
    const newState = {...wrapper.state()};

    it('must set the correct state props', () => {
      expect(newState).toMatchObject({
        requestParams: {
          ...oldState.requestParams,
          sort: 'SORT'
        },
        itemsDisplayed: oldState.itemsDisplayed
      });
    });

    it('must call state.itemsSortFunc()', () => {
      expect(itemsSortFuncSpy.calledWith(oldState.itemsDisplayed, 'SORT')).toBeTruthy();
    });
  });
});
