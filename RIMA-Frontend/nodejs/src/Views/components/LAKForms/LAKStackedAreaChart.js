//Done by Swarna
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class LAKStackedAreaChart extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.selectInputRef1 = React.createRef();
    this.selectValue = this.selectValue.bind(this);
    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.clickEvent = this.clickEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.checkIfMounted = this.checkIfMounted.bind(this);
    this.state = {
      soptions: [],
      newOptions: [],
      weights: [],
      years: [],
      loader: false,
      display: "none",
      opacity: "0.9",
      selectOptions: [],
      selectedValues: [],
      combinedList: [],
      yearsList: [],
      isLoaded: false,
      selectValue: "",
      selectTopic: "",
      series: [],
      flag: false,
      key: "",
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      imageTooltipOpen: false,
      display1: "none",
      textinput: "",
    };
  }

  checkIfMounted() {
    console.log("mount");
    return this.selectInputRef1.current != null;
  }

  selectKey(e) {
    this.onClear();

    console.log(e.target.value);
    fetch(BASE_URL_CONFERENCE + "getallkeysresults/keyword/"  + this.props.conferenceName)
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        this.setState({
          active1: false,
          active2: true,
          soptions: json.topics.sort((a, b) => (a.label > b.label ? 1 : -1)),
          key: "key",
          
        });
      });
  }

  selectTopic(e) {
    this.onClear();
    fetch(BASE_URL_CONFERENCE + "getalltopicsresults/topic/" + this.props.conferenceName)
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        this.setState({
          active1: true,
          active2: false,
          soptions: json.topics.sort((a, b) => (a.label > b.label ? 1 : -1)),
          key: "topic",
        });
      });
    console.log("options:", this.state.soptions);
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState({
      selectTopic: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedValues: value,
    });
    console.log("value is:", this.state.selectedValues);
  };

  selectValue(e) {
    var selectValue = this.state.selectValue;
    var isDisplayed = this.state.isDisplayed;
    console.log("the val is:", e);
    console.log("the val is:", e.length);
    console.log("the val is:", e[0].value);
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    this.setState({
      active1: false,
      active2: true,
      selectedValues: value,
    });

    console.log(this.state.selectedValues);
  }

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };

  onClear() {
    //window.location.reload(false);
    console.log(this.selectInputRef.current.select.state.selectValue);
    if (this.selectInputRef.current.select.state.selectValue == "") {
      console.log("set");
    } else {
      console.log("unset");
      this.selectInputRef.current.select.clearValue();
    }
    // this.selectInputRef.current.select.clearValue();
    this.setState({
      active3: false,
      active4: true,
      opacity: "0",
    });
  }

  //this.selectInputRef1.current.chart.destroy();}
  clickEvent() {
    if (this.state.key == "topic") {
      if (this.selectInputRef1.current == null) {
        console.log("true");
        this.setState({
          loader: true,
          display: "block",
        });
      } else {
        //this.selectInputRef1.current=null
        this.setState({
          opacity: "0.1",
          loader: true,
          display: "block",
        });
      }

      console.log("in click event", this.state.selectedValues);
      var selectedValues = this.state.selectedValues;
      var {series} = this.state;

      fetch(
        BASE_URL_CONFERENCE +
        "getalltopicsevolution/" + this.props.conferenceName +"/" +
        "?" +
        selectedValues.join("&")  
      )
        .then((response) => response.json())
        .then((json) => {
          series = [];
          for (let i = 0; i < json.weights.length; i++) {
            series = series.concat([
              {name: selectedValues[i], data: json.weights[i]},
            ]);
            //selectInputRef1.current.chart.publicMethods.updateOptions({})
          }

          console.log("series", series);
          this.setState({
            selectTopic: selectedValues,
            active1: true,
            active2: false,
            active3: true,
            active4: false,
            series: series,
            datalabels: {
              enabled: true,
            },
            options: {
              stroke: {
                curve: "smooth",
              },
              xaxis: {
                categories: json.years,
              },
            },
            isLoaded: true,
            loader: false,
            opacity: "0.9",
          });
        });
    } else {
      if (this.selectInputRef1.current == null) {
        console.log("true");
        this.setState({
          loader: true,
          display: "block",
        });
      } else {
        //this.selectInputRef1.current=null
        this.setState({
          opacity: "0.1",
          loader: true,
          display: "block",
        });
      }

      console.log("in click event", this.state.selectedValues);
      var selectedValues = this.state.selectedValues;
      var {series} = this.state;

      fetch(
        BASE_URL_CONFERENCE +
        "getallkeysevolution/"  +
        "?" +
        selectedValues.join("&")+"/"  + this.props.conferenceName 
      )
        .then((response) => response.json())
        .then((json) => {
          console.log("json", json);
          if (json != null) {
            series = [];
            for (let i = 0; i < json.weights.length; i++) {
              console.log("selectedValues[i]", selectedValues[i]);
              series = series.concat([
                {name: selectedValues[i], data: json.weights[i]},
              ]);
              //selectInputRef1.current.chart.publicMethods.updateOptions({})
            }
            console.log("series", series);
            this.setState({
              selectTopic: selectedValues,
              active1: false,
              active2: true,
              active3: true,
              active4: false,
              series: series,
              datalabels: {
                enabled: true,
              },
              options: {
                stroke: {
                  curve: "smooth",
                },
                xaxis: {
                  categories: json.years,
                },
              },
              isLoaded: true,
              loader: false,
              opacity: "0.9",
            });
          } else {
            this.setState({
              flag: true,
            });
          }
        });
    }
  }

  render() {
    const checkmount = this.checkIfMounted;
    var {
      active2,
      newOptions,
      isLoaded,
      loader,
      active1,
      opacity,
      soptions,
      display,
      display1,
      selectTopic,
      textinput,
      active3,
      active4,
    } = this.state;
    if (isLoaded) {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Evolution of topics/keywords over time</h2>
              <br></br>
              <p>
                This chart displays the evolution of topics/keywords over all
                years of the selected conference
              </p>
              <br></br>

              <Button
                color="primary"
                outline
                active={active1}
                value="topic"
                onClick={this.selectTopic}
              >
                Topic
              </Button>
              <Button
                outline
                color="primary"
                value="key"
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
                    left: "10px",
                    width: "400px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    {" "}
                    Hover over legend to highlight the evolution of a
                    topic/keyword
                  </p>
                </div>
              )}

              <br/>
              <div style={{color: "green", display: display1}}>
                <Label>{textinput}</Label>
              </div>
              <br/>
              <Label>Select topics/keywords</Label>

              <div style={{width: "600px"}}>
                <Select
                  ref={this.selectInputRef}
                  name="selectOptions"
                  isClearable
                  isMulti
                  placeholder="Select Option"
                  options={soptions}
                  value={soptions.find((obj) => obj.value === selectTopic)}
                  onChange={this.handleChange}
                />
              </div>
              <br/>
              <Button
                outline
                color="primary"
                active={active3}
                onClick={this.clickEvent}
              >
                Compare
              </Button>
              <Button
                outline
                color="primary"
                active={active4}
                onClick={this.onClear}
              >
                Reset
              </Button>

              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <div style={{backgroundColor: "white", display: display}}>
                  <Loader
                    type="Bars"
                    visible={loader}
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            </FormGroup>
          </Form>
          <div style={{opacity: opacity}}>
            <ReactApexChart
              ref={this.selectInputRef1}
              options={this.state.options}
              series={this.state.series}
              type="area"
              height={350}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div id="chart">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Evolution of topics/keywords over time</h2>
              <br/>
              <p>
                This chart displays the evolution of topics/keywords over all
                years of the selected conference
              </p>
              <br/>
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
                color="primary"
                value="key"
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
                    left: "10px",
                    width: "400px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    {" "}
                    Hover over legend to highlight the evolution of a
                    topic/keyword
                  </p>
                </div>
              )}

              <br/>
              <br/>
              <Label>Select topics/keywords</Label>

              <br/>

              <div style={{width: "600px"}}>
                <Select
                  ref={this.selectInputRef}
                  name="selectOptions"
                  isClearable
                  isMulti
                  placeholder="Select Option"
                  options={soptions}
                  value={soptions.find((obj) => obj.value === selectTopic)}
                  onChange={this.handleChange}
                />
              </div>

              <br/>
              <Button
                outline
                active={active3}
                color="primary"
                onClick={this.clickEvent}
              >
                Compare
              </Button>
              <Button
                outline
                active={active4}
                color="primary"
                onClick={this.onClear}
              >
                Reset
              </Button>
              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <div style={{backgroundColor: "white", display: display}}>
                  <Loader
                    type="Bars"
                    visible={loader}
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            </FormGroup>
          </Form>
        </div>
      );
    }
  }
}

export default LAKStackedAreaChart;
