import React, { Component } from "react";
import styled from "styled-components";

const Card = styled.div`
  background: white;
  margin-bottom: 1vh;
`;
const SliderContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
`;
export const Checkbox = styled.input`
  input[type="checkbox"] + label:before {
    border: 1px solid #333;
    border-color: rgb(191, 191, 191);
    content: "\00a0";
    display: inline-block;
    font: 16px/1em sans-serif;
    height: 16px;
    margin: 0 0.25em 0 0;
    padding: 0;
    vertical-align: top;
    width: 16px;
  }
  input[type="checkbox"]:checked + label:before {
    background: #fff;
    color: #333;
    content: "\2713";
    text-align: center;
  }
  input[type="checkbox"]:checked + label:after {
    font-weight: bold;
  }

  input[type="checkbox"]:focus + label::before {
    outline: rgb(59, 153, 252) auto 5px;
  }
`;

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: ${(props) => props.inputColor || "palevioletred"};
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &:-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }

  &:-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
`;
const DisplayValue = styled.p`
  margin-bottom: 5px;
  margin-right: 5px;
`;

export class KeywordRangeSlider extends Component {
  state = {
    value: this.props.weight,
    defaultChecked: true,
  };

  handleOnChange = (e) => {
    const newWeight = e.target.value;
    this.setState({ value: newWeight });
    const { tagId } = this.props;

    const { color } = this.props.color;
    this.props.setWeightOfkeyword(tagId, newWeight);
  };
  checkHandler = (e) => {
    this.setState({ defaultChecked: !this.state.defaultChecked });

    if (this.state.defaultChecked === true) {
      let tagId = this.props.tagId;
      this.props.filterUsers(e, tagId, "create");
    } else {
      let tagId = this.props.tagId;
      this.props.filterUsers(e, tagId, "delete");
    }
  };
  render() {
    // let checkedValues = [];
    // if (this.state.defaultChecked) {
    //   checkedValues = this.props.text;
    // } else {
    //   checkedValues = !this.props.text;
    // }
    // console.log(checkedValues);
    const { tagId, text, weight, color } = this.props;
    return (
      <Card>
        {/* <Checkbox
          type="checkbox"
          id="visualisation1"
          name="cb"
          defaultChecked={false}
          onChange={this.checkHandler}
        />{" "}
        {"  "} */}
        <label
          // for={text}
        >
          {text}
        </label>
        <SliderContainer>
          <Slider
            type="range"
            min={1}
            max={5}
            step="0.1"
            value={this.state.value}
            inputColor={color}
            onChange={this.handleOnChange}
          />
          <p> {this.state.value} </p>
        </SliderContainer>
      </Card>
    );
  }
}
