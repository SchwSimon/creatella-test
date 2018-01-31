import fetch from 'isomorphic-fetch';
import sinon from 'sinon';
import { API_ROUTE, DEFAULT_REQUEST_PARAMS, requestProducts } from '../../requestService/request-products';

describe('Constants', () => {
  it('API_ROUTE', () => {
    expect(API_ROUTE).toBe('/api/products');
  });

  it('DEFAULT_REQUEST_PARAMS', () => {
    expect(DEFAULT_REQUEST_PARAMS).toEqual({
      page: 0,
      limit: 15,
      sort: 'id'
    });
  });
});

describe('function requestProducts()', () => {
  const fetchStub = sinon.stub(window, 'fetch').returns({
    json: () => 'RESPONSE_JSON'
  });

  it('must return the json response', async () => {
    expect(await requestProducts()).toBe('RESPONSE_JSON');
  });

  it('must call fetch with the correct URL', () => {
    expect(fetchStub.calledWith(API_ROUTE + '?_page=' + DEFAULT_REQUEST_PARAMS.page + '&_limit=' + DEFAULT_REQUEST_PARAMS.limit + '&_sort=' + DEFAULT_REQUEST_PARAMS.sort)).toBeTruthy();
  });

  it('must call fetch with the correct URL', async () => {
    const params = {page: 5, limit: 50, sort: 'price'};
    await requestProducts(params);

    expect(fetchStub.calledWith(API_ROUTE + '?_page=' + params.page + '&_limit=' + params.limit + '&_sort=' + params.sort)).toBeTruthy();
  });
});
