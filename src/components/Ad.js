import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { genAdsQueryValue } from "../actions/ads-actions";

import '../styles/Ad.css';

const mapStateToProps = state => ({
  queryKeyValues: state.ads.queryKeyValues
});

const mapActionsToProps = {
  genAdsQueryValue: genAdsQueryValue
};

export class Ad extends Component {
  constructor(props) {
    super(props);

      // generate a unique id (okay for less than 10000 ids)
      // this key is used to identify the generated query value from the main redux store
    const adKey = Math.random().toString(36).substr(2, 9);

    this.state = {
      adKey: adKey,
      source: null
    };

      // generate a new query value for the current component reference
    props.genAdsQueryValue(adKey);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.source && nextProps.queryKeyValues[this.state.adKey])
      this.setState({source: nextProps.queryKeyValues[this.state.adKey]})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.source && this.state.source !== nextState.source)
      return true;
    return false
  }

  render() {
    return (
      <div className="Ad">
        <aside className="Ad-content">
          {this.state.source &&
            <img
              className="Ad-main"
              src={'/ads/?r=' + this.state.source}
              alt="ad"
            />
          }
        </aside>
      </div>
    );
  }
}

Ad.propTypes = {
  genAdsQueryValue: PropTypes.func.isRequired,
  queryKeyValues: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapActionsToProps)(Ad);
