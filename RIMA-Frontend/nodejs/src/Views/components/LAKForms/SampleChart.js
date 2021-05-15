import React, {Component} from "react";
import "d3-transition";
import {BASE_URL_INTEREST} from '../../../Services/constants';
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
/* Chart code */
// Themes begin
// Themes end
import {
  Button,
  Label,
  FormGroup,
  Form,

} from "reactstrap";
import ReactApexChart from "react-apexcharts";

class SampleChart extends Component {
  constructor(props) {
    super(props);
    this.printText = this.printText.bind(this);
    this.state = {
      text: "Hello World!",
      btext: "",
      isLoaded: false
    };
  }

  printText() {
    fetch(BASE_URL_INTEREST + "updateprinttext/")
      .then(response => response.json())
      .then(json => {
        this.setState({
          btext: json.btext,
          isLoaded: true
        })
      })
  }

  render() {
    var {text, btext, isLoaded} = this.state;
    if (isLoaded) {
      return (
        <>
          <Label>{btext}</Label>
        </>
      )

    } else {
      return (
        <>
          <Label>{text}</Label>
          <Button onClick={this.printText}>Call Backend</Button>
        </>
      )
    }

  }
}

export default SampleChart;
