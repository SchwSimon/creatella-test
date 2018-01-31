require('babel-polyfill');  // needed for the async function

export const API_ROUTE = '/api/products';

export const DEFAULT_REQUEST_PARAMS = {
  page: 0,
  limit: 15,
  sort: 'id'
};

/**
 * request products (async)
 * @param {Object} data request parameters
 * * - page {Number} item page
 * * - limit {Number} item request limit
 * * - sort {String} sort by 'id' | 'price' | 'size'
 * @return {Array} requested product items
 *
 * BUG: following declaration throws on TEST run
 * * eferenceError: regeneratorRuntime is not defined
 * * export async function requestProducts(params = {}) {
 */
export const requestProducts = async (params = {}) => {
  const page = params.page || DEFAULT_REQUEST_PARAMS.page;
  const limit = params.limit || DEFAULT_REQUEST_PARAMS.limit;
  const sort = params.sort || DEFAULT_REQUEST_PARAMS.sort;

  let response = await fetch(API_ROUTE + '?_page=' + page + '&_limit=' + limit + '&_sort=' + sort);
  let responseJson;
  try {
    responseJson = await response.json();
  } catch(error) {
    console.log('Products request error', error);
    return false;
  }

  return responseJson;
}
