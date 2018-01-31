import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppStore from './reducers/index';

import App from './containers/App';

import './styles/index.css';

const store = createStore(AppStore);

if (process.env.NODE_ENV === 'development')
  store.subscribe(() => { // log store changes
  	console.log(store.getState())
  });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
