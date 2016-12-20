import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import SSRCachingSimpleType from "./SSRCachingSimpleType";

class SSRCachingSimpleTypeWrapper extends Component {
  render() {
    const count = this.props.count;

    let elements = [];

    for (let i = 0; i < count; i++) {
      elements.push(<SSRCachingSimpleType key={i} navEntry={"NavEntry" + i} />);
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}

SSRCachingSimpleTypeWrapper.propTypes = {
  count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  count: state.count
});

export default connect(
  mapStateToProps
)(SSRCachingSimpleTypeWrapper);