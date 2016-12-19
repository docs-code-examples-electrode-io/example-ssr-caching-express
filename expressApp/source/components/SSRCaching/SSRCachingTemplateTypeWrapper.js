import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SSRCachingTemplateType from "./SSRCachingTemplateType";

class SSRCachingTemplateTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;
    let elements = [];

    for(let i = 0; i < count; i++) {
      elements.push(<SSRCachingTemplateType key={i} name={"name"+i} title={"title"+i} rating={"rating"+i}/>);
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}

SSRCachingTemplateTypeWrapper.propTypes = {
  count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  count: state.count
});

export default connect(
  mapStateToProps
)(SSRCachingTemplateTypeWrapper);
