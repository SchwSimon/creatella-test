import React, { PureComponent } from 'react';
import ItemsGrid from '../components/ItemsGrid';
import Ad from '../components/Ad';
import { requestProducts } from '../requestService/request-products';

import '../styles/App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Products Grid</h1>

          <p className="App-intro">
            Here you´re sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.
          </p>
        </header>

        <section className="App-products">
          <ItemsGrid
            fetchLimitInitial={30}
            fetchLimit={15}
            fetchPage={0}
            fetchSort={'id'}
            fetchItemsCallback={requestProducts}
            itemsSortTypes={['id', 'price', 'size']}
            itemsSortFunc={(items, sortBy) => {
              const sortedItems = items.map(item => ({...item}));
              sortedItems.sort((a, b) => a[sortBy] > b[sortBy]);
              return sortedItems;
            }}
            enableSpecialItems={true}
            specialItemEvery={20}
            specialItemComponent={Ad}
          />
        </section>
      </div>
    );
  }
}

export default App;
