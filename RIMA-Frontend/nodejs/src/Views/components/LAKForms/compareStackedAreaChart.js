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

import RestAPI from "../../../Services/api";
// react plugin used to create google maps
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { handleServerErrors } from "Services/utils/errorHandler";


class CompareStackedAreaChart extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.selectInputRef1 = React.createRef();

    this.state = {
      conferencesNames:[],
      selectConference:"",
      selectedConferences:[],
      words:[],
      selectedOption:"",
      weights : [],

      
      soptions: [],
      newOptions: [],
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

  //BAB

  componentDidMount() {
    this.getConferencesNames()
  }



  //** GET ALL CONFERENCES **//
  getConferencesNames = () => {
    RestAPI.getConferencesNames()
      .then((response) => {
        this.setState({
          isLoding: false,
          conferencesNames: response.data,
        });

      })
      .catch((error) => {
        this.setState({ isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };


  wordhandleChange = (e) =>{
    console.log(e.value)
    this.setState({
      selectValue: e.value
    })
    console.log(this.state.selectValue)


  }

  conferenceshandleChange = (e) => {

    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    });
    console.log("value is:", this.state.selectedConferences);

  }



  selectSharedTopics = (e) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWords/topic/?" + this.state.selectedConferences.join("&"))
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        this.setState({
          active1: true,
          active2: false,
          words: json.words.sort((a, b) => (a.label > b.label ? 1 : -1)),
          key: "topic",
          selectedConferences: this.state.selectedConferences,
        });
      });
    console.log("options:", this.state.soptions);
  }



  checkIfMounted = ()=> {
    console.log("mount");
    return this.selectInputRef1.current != null;
  }

  selectKey = (e) => {
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


  
  selectTopic = (e) => {
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

  


  handleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState({
      selectTopic: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedValues: value,
    });
    console.log("value is:", this.state.selectedValues);
  };

  selectValue = (e) => {
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

  onClear = () => {
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
  clickEvent =() => {
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

      //console.log("in click event", this.state.selectedValues);
      var selectedValues = this.state.selectedValues;
      console.log("in click event", selectedValues);
      var {series} = this.state;
      var {weights} =  this.state;

      fetch(
        BASE_URL_CONFERENCE +
        "getSharedWordEvolution/topic/" + this.state.selectValue +"/" +
        "?" +
        this.state.selectedConferences.join("&")  
      )
        .then((response) => response.json())
        .then((json) => {
          series = [];
          weights = [];
          for (let index = 0; index < this.state.selectedConferences.length; index++ ){
            for (let i = 0; i < json.weights.length; i++) {
                weights[i] = json.weights[i][index]
            }
                series = series.concat([
                {name: this.state.selectedConferences[index], data: weights,}]);

            console.log("weights", weights);
            weights = [];
            
        }
          console.log("series", series);
          console.log("this.state.selectedConferences", this.state.selectedConferences);
          this.setState({
            selectConference: this.state.selectedConferences,
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
        "getallkeysevolution/keyword/"  + this.props.conferenceName +"/" +
        "?" +
        selectedValues.join("&")
      )
        .then((response) => response.json())
        .then((json) => {
          console.log("json", json);
          if (json != null) {
            series = [];
            weights = [];
            for (let i = 0; i < json.weights.length; i++) {
                for(let j = 0; j < selectedValues.length;j++)
                {
                weights[j] = json.weights[i][j]
                }
                
                series = series.concat([
                {name: selectedValues[i], data: weights,}
              
            ]);
            
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
      conferencesNames,
      selectConference,
      selectedConferences,
      words,
      selectedOption

    } = this.state;


    if (isLoaded) {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Evolution of topics/keywords in Conferences over time</h2>
              <br/>
              <p>
              This chart displays the evolution of a topic/keywords over all
                years of the selected conferences
              </p>
              <br/>

                
            <Label>Select conferences</Label>

            <div style={{width: "600px"}}>
            <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select Option"
                options={conferencesNames}
                value={conferencesNames.find((obj) => obj.value === selectTopic)}
                onChange={this.conferenceshandleChange}
            />

            </div>
<              br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectSharedTopics}
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
              <Label>Select a topic/keyword</Label>
              <br/>
              <div style={{width: "250px"}}>
              <Select
                placeholder="Select conference"
                options={words}
                value={words.find((obj) => obj.value === selectTopic)}
                onChange={this.wordhandleChange}
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
              <h2>Evolution of topics/keywords in Conferences over time</h2>
              <br/>
              <p>
              This chart displays the evolution of a topic/keywords over all
                years of the selected conferences
              </p>
              <br/>

                
            <Label>Select conferences</Label>

            <div style={{width: "600px"}}>
            <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select Option"
                options={conferencesNames}
                value={conferencesNames.find((obj) => obj.value === selectTopic)}
                onChange={this.conferenceshandleChange}
            />

            </div>
<              br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectSharedTopics}
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
              <Label>Select a topic/keyword</Label>
              <br/>
              <div style={{width: "250px"}}>
              <Select
                placeholder="Select conference"
                options={words}
                value={words.find((obj) => obj.value === selectTopic)}
                onChange={this.wordhandleChange}
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

export default CompareStackedAreaChart;
