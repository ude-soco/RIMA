//Done by Swarna
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "d3-transition";
import {BASE_URL_INTEREST} from "../../constants";
import "react-tabs/style/react-tabs.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

/* Chart code */
// Themes begin
// Themes end

import {Button, Row, Col, Label} from "reactstrap";

window.$value = "";

class VennChart extends Component {
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

  componentDidMount() {
    //console.log("the json is ******************")
    this.setState({
      display1: "block",
      loader: true,
      display: "none",
    });
    fetch(BASE_URL_INTEREST + "commontopics/2011/2012")
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectVal: "2011",
          selectValue2: "2012",
          items_y1: json.commontopics,
          display: "block",
          isLoaded: true,
          display1: "none",
          loader: false,
        });
      });
  }

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

    const data = [
      {
        value: "2011",
        label: "2011",
      },
      {
        value: "2012",
        label: "2012",
      },
      {
        value: "2013",
        label: "2013",
      },
      {
        value: "2014",
        label: "2014",
      },
      {
        value: "2015",
        label: "2015",
      },
      {
        value: "2016",
        label: "2016",
      },
      {
        value: "2017",
        label: "2017",
      },
      {
        value: "2018",
        label: "2018",
      },
      {
        value: "2019",
        label: "2019",
      },
      {
        value: "2020",
        label: "2020",
      },
    ];
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
              <Col>
                <Select
                  placeholder="Year1"
                  options={data}
                  value={data.find((obj) => obj.value === selectVal)}
                  onChange={this.selectValueYear1}
                />
              </Col>
              <Col>
                <Select
                  placeholder="Year2"
                  options={data}
                  value={data.find((obj) => obj.value === selectValue2)}
                  onChange={this.selectValue}
                />
              </Col>
            </Row>
            <br/>
            <Button
              outline
              color="primary"
              active={active1}
              value="topic"
              onClick={this.selectTopic}
            >
              Topic
            </Button>
            <Button
              outline
              value="keyword"
              color="primary"
              active={active2}
              onClick={this.selectKey}
            >
              Keyword
            </Button>
            <i
              className="fas fa-question-circle text-blue"
              onMouseOver={() => this.handleToogle(true)}
              onMouseOut={() => this.handleToogle(false)}
            />
            {this.state.imageTooltipOpen && (
              <div
                className="imgTooltip"
                style={{
                  marginTop: "0px",
                  position: "relative",
                  left: "205px",
                  width: "500px",
                  height: "40px",
                  color: "#8E8E8E",
                  border: "1px solid #BDBDBD",
                }}
              >
                <p>Info about common topics between two years of conference</p>
              </div>
            )}
            <br/>
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
          <h2>Common topics/keywords</h2>
          <br/>
          <p>
            This visualization provides common topics/keywords for the selected
            year
          </p>
          <br/>
          <Label>Select two years to compare</Label>
          <Row>
            <Col>
              <Select
                placeholder="Year1"
                options={data}
                value={data.find((obj) => obj.value === selectVal)}
                onChange={this.selectValueYear1}
              />
            </Col>
            <Col>
              <Select
                placeholder="Year2"
                options={data}
                value={data.find((obj) => obj.value === selectValue2)}
                onChange={this.selectValue}
              />
            </Col>
          </Row>

          <br/>
          <Button
            outline
            color="primary"
            active={active1}
            value="topic"
            onClick={this.selectTopic}
          >
            Topic
          </Button>
          <Button
            outline
            value="keyword"
            color="primary"
            active={active2}
            onClick={this.selectKey}
          >
            Keyword
          </Button>
          <i
            className="fas fa-question-circle text-blue"
            onMouseOver={() => this.handleToogle(true)}
            onMouseOut={() => this.handleToogle(false)}
          />
          {this.state.imageTooltipOpen && (
            <div
              className="imgTooltip"
              style={{
                marginTop: "0px",
                position: "relative",
                left: "205px",
                width: "500px",
                height: "40px",
                color: "#8E8E8E",
                border: "1px solid #BDBDBD",
              }}
            >
              <p>Info about common topics between two years of conference</p>
            </div>
          )}

          <br/>
          <br></br>
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
        </>
      );
    }
  }
}

export default VennChart;
