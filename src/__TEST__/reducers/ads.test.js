import sinon from 'sinon';
import reducer, { initialState } from '../../reducers/ads-reducer';
import * as types from '../../actions/action-types';

describe('reducer: ads', () => {
  const defaultState = {
    queryKeyValues: {},
  	queryValues: []
  };

  it('initial state', () => {
    expect(initialState).toEqual(defaultState);
  });

  it('return initialState on default action', () => {
    expect(reducer(undefined, {type: null})).toEqual(defaultState);
  });

  it('GENERATE_QUERY_VALUE', () => {
    const mathFloorStub = sinon.stub(Math, 'floor').returns(12345);
    const action = {
      type: types.GENERATE_QUERY_VALUE,
      payload: 'AD_KEY'
    };
    const state = {
      ...defaultState,
      queryValues: [12345],
      queryKeyValues: {'AD_KEY': 12345}
    };
    expect(reducer(undefined, action)).toEqual(state);
  });
});
