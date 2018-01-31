import * as types from '../../actions/action-types';
import * as actions from '../../actions/ads-actions';

describe('Actions', () => {
  it('genAdsQueryValue', () => {
    const payload = 'AD_KEY';
    expect(actions.genAdsQueryValue(payload)).toEqual({
      type: types.GENERATE_QUERY_VALUE,
      payload
    });
  });
});
