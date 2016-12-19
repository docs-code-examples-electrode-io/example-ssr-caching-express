import React, { Component, PropTypes } from "react";

class SSRCachingTemplateType extends Component {
  render() {
    return (
      <div>
        <p>{this.props.name} and {this.props.title} and {this.props.rating}</p>
      </div>
    );
  }
}

SSRCachingTemplateType.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired
};

export default SSRCachingTemplateType;
