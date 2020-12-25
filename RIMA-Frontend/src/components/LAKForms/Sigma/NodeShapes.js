// @flow
import React from "react";
import "./nodes";

class NodeShapes extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.sigma && this.props.default)
      this.props.sigma.settings({ defaultNodeType: this.props.default });
  }
  render = () => null;
}

export default NodeShapes;
