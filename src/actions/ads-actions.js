import * as types from './action-types';

export const genAdsQueryValue = adKey => ({
  type: types.GENERATE_QUERY_VALUE,
  payload: adKey
});
