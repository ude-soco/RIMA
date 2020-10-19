import React, { Component } from "react";
import { Resizable } from "re-resizable";
import Draggable, { DraggableCore } from "react-draggable";
import ReactTooltip from 'react-tooltip';
import styled from "styled-components";

const Img = styled.img`
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-color: ${(props) => props.color};
`;

class DragableImage extends React.Component {
  constructor(props) {
    super(props);
    this.imageURL = props.imageURL;
    this.id_str = props.id_str;
    this.username = props.username;
  }

  getDefaultPosition() {
    const { weightMultiplier, weight } = this.props;
    return {
      x: weight ? weight * weightMultiplier : weightMultiplier,
      y: weight ? weight * weightMultiplier : weightMultiplier,
    };
  }

  onDragStop(event, dragData) {
    let newTweets = [];
    this.props.tweets.map((tweet) => {
      if(tweet.user.id_str === this.props.id_str) {
        tweet.border = true;
      } else {
        tweet.border = false;
      }
      newTweets.push(tweet);
    });
    this.props.makeBorder(newTweets);
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

  render = () => {
    const { centerOfCircle, weight, weightMultiplier } = this.props;
    return (
      <>
      <a href="#border">
      <Draggable
        defaultPosition={this.getDefaultPosition()}
        bounds="parent"
        // handle=".handle"
        // position={null}
        // grid={[25, 25]}  
        // scale={1}
        // onStart={this.handleStart}
        // onDrag={this.handleDrag}
        onStop={this.onDragStop.bind(this)}
      >
        <Img data-tip={this.username ? this.username : 'name'} color={this.props.color} src={this.imageURL} />
      </Draggable>
      </a>
      <ReactTooltip effect="solid" />
      </>
    );
  };
}

export default DragableImage;
