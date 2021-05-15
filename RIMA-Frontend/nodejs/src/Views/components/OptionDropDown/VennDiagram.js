//Done by Swarna
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "d3-transition";
import {BASE_URL_INTEREST} from "../../../Services/constants";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

/* Chart code */
// Themes begin
// Themes end

import {Button, Row, Col, Label} from "reactstrap";

window.$value = "";

class VennDiagram extends Component {
  constructor(props) {
    super(props);

    this.selectValue = this.selectValue.bind(this);
    this.selectValueYear1 = this.selectValueYear1.bind(this);
    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.state = {
      isLoaded: false,
      active1: true,
      active2: false,
      items_y1: [],
      items_y2: [],
      items_y12: [],
      arr_keys: [],
      arr_vals: [],
      loader: false,
      display: "none",
      display1: "none",
      selectValue2: "",
      selectVal: "",
      data: [],
    };
  }

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };



  selectValueYear1(e) {
    this.setState({
      selectVal: e.value,
    });
  }

  selectKey(e) {
    this.setState({
      active1: false,
      active2: true,
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(
      BASE_URL_INTEREST +
      "commonkeys/" +
      this.state.selectVal +
      "/" +
      this.state.selectValue2
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectValue: e.value,
          items_y1: json.commontopics,

          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });
  }

  selectTopic(e) {
    this.setState({
      active1: true,
      active2: false,
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(
      BASE_URL_INTEREST +
      "commontopics/" +
      this.state.selectVal +
      "/" +
      this.state.selectValue2
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectValue: e.value,
          items_y1: json.commontopics,
          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });
  }

  selectValue(e) {
    this.setState({
      selectValue2: e.value,
    });
  }

  render() {
    var {
      isLoaded,
      desc,
      selectValue2,
      selectVal,
      items_y1,
      display1,
      display,
      loader,
      active1,
      active2,
    } = this.state;


    //var{items,arr_keys,arr_vals}=this.state;
    if (isLoaded) {
      return (
        <>
          <div/>
          {console.log(desc)}
          <br/>
          <React.Fragment>
            <h2>Common topics/keywords</h2>
            <br/>
            <p>
              This visualization provides common topics/keywords for the
              selected year
            </p>
            <br/>
            <Label>Select two years to compare</Label>
            <Row>
            </Row>
            <br/>


            <Row>
              <div
                style={{
                  backgroundColor: "white",
                  display: display1,
                  width: "100px",
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <Loader
                  type="Bars"
                  visible={loader}
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              </div>

              <div style={{display: display}}>
                <img
                  src={`data:image/png;base64,${items_y1}`}
                  style={{marginLeft: "50px"}}
                />
              </div>
            </Row>
          </React.Fragment>
        </>
      );
    } else {
      return (
        <>
        </>
      );
    }
  }
}

export default VennDiagram;
