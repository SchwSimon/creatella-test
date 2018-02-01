import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import Item from './Item';
import Idle from './Idle';

import loadingGIF from '../assets/loading.gif';
import '../styles/ItemsGrid.css';

class ItemsGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requestParams: {
        page: props.fetchPage || null,    // data fetch page
        limit: props.fetchLimit || null,  // data fetch limit
        sort: props.fetchSort || null     // data fetch sort order
      },
      itemsCache: [],       // item data NOT displayed
      itemsDisplayed: [],   // item data displayed
      itemsSortTypes: props.itemsSortTypes || null, // choosable sort types
      itemsSortFunc: props.itemsSortFunc || null,   // sort callback function
      fetchCount: 0,        // amount of api requests
      isFetching: false,    // currently fetching data?
      isEndOfItems: false,  // no more items to fetch?
      specialItemEnabled: props.enableSpecialItems || false,  // enable "special" item render
      specialItemEvery: props.specialItemEvery || 20          // render after each X items a given "special" item
    };

    this.onLoadmore = this.onLoadmore.bind(this);
    this.onIdle = this.onIdle.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isFetching !== nextState.isFetching
      || this.state.isEndOfItems !== nextState.isEndOfItems
        || this.state.requestParams.sort !== nextState.requestParams.sort
          || this.state.itemsDisplayed.length !== nextState.itemsDisplayed.length)
      return true;
    return false;
  }

    // on end of grid scroll trigger
  onLoadmore() {
    const itemPuffer = this.state.itemsCache.length;

      // if there is atleast 1 item in the puffer, render a new set of items immediately
    if (itemPuffer > 0)
      this.pushDisplayedItems();

      // we dont need to request more items at this time
      // if the puffer contains atleast 3 times the request limit
    if (itemPuffer >= this.state.requestParams.limit * 3)
      return;

      // request a new set of items
    this.getItems();
  }

    // push a new set of items from the state.itemsCache to the state.itemsDisplayed
    // & if state.itemsSortFunc is given do sort
  pushDisplayedItems() {
    this.setState(prevState => {
      const itemsCache = [...prevState.itemsCache];
      const itemsPush = [];
      for(let i = 0; i < prevState.requestParams.limit; i++) {
        if (!itemsCache.length)
          break;
        itemsPush[i] = itemsCache.shift();
      }

      return {
        itemsDisplayed: prevState.itemsSortFunc
          ? prevState.itemsSortFunc(prevState.itemsDisplayed.concat(itemsPush), prevState.requestParams.sort)
          : prevState.itemsDisplayed.concat(itemsPush),
        itemsCache: itemsCache
      }
    });
  }

    // request new items
  async getItems() {
    if (this.state.isFetching)
      return;

      // cache the current fetch counter
    const fetchCount = this.state.fetchCount;

    this.setState(prevState => ({
      isFetching: true,
      fetchCount: prevState.fetchCount + 1
    }));

    const params = {...this.state.requestParams};

      // fetch more items for the initial request
    if (fetchCount === 0 && this.props.fetchLimitInitial)
      params.limit = this.props.fetchLimitInitial;

      // wait till items are fetched
    const fetchedItems = await this.props.fetchItemsCallback(params);

    this.setState(prevState => ({
      requestParams: {
        ...prevState.requestParams,
        page: prevState.requestParams.page + 1
      },
      isFetching: false,
      itemsCache: prevState.itemsCache.concat(fetchedItems),
      isEndOfItems: (fetchedItems.length === 0) ? true : false
    }));
  }

    // request new items if the client status switches to idle
  onIdle(isIdle) {
    if (isIdle)
      this.getItems();
  }

    // on displayed item sort
  onSort(event) {
    const sortBy = event.target.value;

    this.setState(prevState => ({
      requestParams: {
        ...prevState.requestParams,
        sort: sortBy
      },
      itemsDisplayed: this.state.itemsSortFunc(prevState.itemsDisplayed, sortBy)
    }));
  }

  render() {
    return (
      <div className="ItemsGrid">
        {this.state.itemsSortTypes.length > 0 &&
          <div>
            <span className="ItemsGrid-sortTitle">Sort By</span>
            {this.state.itemsSortTypes.map(type => (
              <button
                key={type}
                className={'ItemsGrid-sortBtn' + (this.state.requestParams.sort === type ? ' active' : '')}
                onClick={this.onSort}
                value={type}
              >{type}</button>
            ))}
          </div>
        }

        <InfiniteScroll
          className="ItemsGrid-scroll"
          element="section"
          loadMore={this.onLoadmore}
          hasMore={!this.state.isEndOfItems}
          threshold={750}
        >
          {this.state.itemsDisplayed.map((item, index) => (
            <div className="ItemsGrid-item" key={item.id + index}>
              {(this.state.specialItemEnabled && (index % this.state.specialItemEvery) === 0 && index)
                ? <this.props.specialItemComponent />
                : null
              }
              <Item
                {...item}
              />
            </div>
          ))}
        </InfiniteScroll>

        {this.state.isFetching &&
          <img
            src={loadingGIF}
            className="ItemsGrid-loading"
            alt="Loading items..."
          />
        }

        {this.state.isEndOfItems &&
          <div className="ItemsGrid-end">~ end of catalogue ~</div>
        }

        <Idle onIdleChange={this.onIdle}/>
      </div>
    );
  }
}

ItemsGrid.propTypes = {
  fetchItemsCallback: PropTypes.func.isRequired,
  fetchPage: PropTypes.number,
  fetchLimit: PropTypes.number,
  fetchLimitInitial: PropTypes.number,
  fetchSort: PropTypes.string,
  itemsSortTypes: PropTypes.array,
  itemsSortFunc: PropTypes.func,
  enableSpecialItems: PropTypes.bool,
  specialItemEvery: PropTypes.number,
  specialItemEnabled: PropTypes.bool,
  specialItemComponent: PropTypes.func
};

export default ItemsGrid;
