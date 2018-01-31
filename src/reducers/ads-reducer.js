import * as types from '../actions/action-types';

export const initialState = {
  queryKeyValues: {},
	queryValues: []
};

export default (state = initialState, action) => {
  switch (action.type) {

      // generate a new ads query parameter value
    case types.GENERATE_QUERY_VALUE: {
			let qValue;
	    do {
	      qValue = Math.floor(Math.random() * 1000)
	    } while(state.queryValues.indexOf(qValue) > -1);

      return {
        ...state,
				queryValues: state.queryValues.concat(qValue),
        queryKeyValues: {
					...state.queryKeyValues,
					[action.payload]: qValue
				}
			}
		}

		default:
			return state;
	}
};
