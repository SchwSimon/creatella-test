import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { dateToElapsedTime } from '../utils/format-date';
import { currencyToString } from '../utils/format-currency';

import '../styles/Item.css';

class Item extends PureComponent {
  render() {
    return (
      <div className="Item">
        <article className="Item-content">
          <div className="Item-content-time">
            <time dateTime={this.props.date}>{dateToElapsedTime(this.props.date)}</time>
          </div>

          <div className="Item-content-face">
            <h3 style={{
              fontSize: this.props.size
            }}>{this.props.face}</h3>
          </div>

          <div className="Item-content-toCart">
            <span className="Item-content-price">${currencyToString(this.props.price)}</span>
            <span className="Item-content-cart"></span>
          </div>
        </article>
      </div>
    );
  }
}

Item.propTypes = {
  date: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  face: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
}

export default Item;
