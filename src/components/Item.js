import React, { PureComponent } from 'react';
import { dateToElapsedTime } from '../utils/format-date';
import { currencyToString } from '../utils/format-currency';

import '../styles/Item.css';

class Item extends PureComponent {
  render() {
    return (
      <div className="Item">
        <article className="Item-content">
          <div>
            <time dateTime={this.props.date}>{dateToElapsedTime(this.props.date)}</time>
          </div>

          <div>
            <h3 style={{
              fontSize: this.props.size
            }}>{this.props.face}</h3>
          </div>

          <div>
            <span>${currencyToString(this.props.price)}</span>
          </div>
        </article>
      </div>
    );
  }
}

export default Item;
