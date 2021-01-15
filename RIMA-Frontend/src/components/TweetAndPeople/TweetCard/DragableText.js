import React, { Component } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import Draggable, { DraggableCore } from "react-draggable";

const StyledText = styled.label`
  border: 1px solid;
  border-radius: 8px;
  padding: 1px;
  background-color: ${(props) => props.bgColor};
  color: #000;
  font-weight: bold;
`;

class DragableText extends Component {
  constructor(props) {
    super(props);
    this.centerOfCircle = props.centerOfCircle;
    // console.log("PROPS OF DRAGGABLE TEXT", props);
    this.setTagDistance();
  }

  getDefaultPosition() {
    const { weightMultiplier, weight } = this.props;
    return {
      x: weight * weightMultiplier,
      y: weight * weightMultiplier,
    };
  }

  setTagDistance() {
    const { tagId, centerOfCircle } = this.props;
    const position = this.getDefaultPosition();
    const x = position.x;
    const y = position.y;
    let fx = x - centerOfCircle["x"];
    let fy = y - centerOfCircle["y"];
    let distance = Math.sqrt(fx * fx + fy * fy);
    this.props.setTagDistance(distance, tagId);
  }

  onDragStop(event, dragData) {
    this.props.onKeywordDrag(event, dragData, this.props.tagId);
  }

  render() {
    const {
      text,
      weight,
      color,
      centerOfCircle,
      weightMultiplier,
      onKeywordDrag,
    } = this.props;
    // console.log("ACTUAL WEIGHT of", text, " is ", weight);
    // console.log(`${text} : ${weight * weightMultiplier}`);
    return (
      <Draggable
        bounds="parent"
        defaultPosition={this.getDefaultPosition()}
        onStop={this.onDragStop.bind(this)}
      >
        <StyledText bgColor={color}> {text} </StyledText> 
      </Draggable>
    );
  }
}

export default DragableText;
