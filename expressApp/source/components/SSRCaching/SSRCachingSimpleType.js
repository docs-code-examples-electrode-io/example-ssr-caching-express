import React, { Component, PropTypes } from "react";

class SSRCachingSimpleType extends Component {
  render() {
    return (
      <div>
        <p>{this.props.navEntry}</p>
      </div>
    );
  }
}

SSRCachingSimpleType.propTypes = {
  navEntry: PropTypes.string.isRequired
};

export default SSRCachingSimpleType;
