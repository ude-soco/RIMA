
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
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { handleServerErrors } from "Services/utils/errorHandler";


class CompareStackedBarChart extends Component {
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
      key: "",

      
      soptions: [],
      years: [],
      loader: false,
      display: "none",
      opacity: "0.9",
      combinedList: [],
      yearsList: [],
      isLoaded: false,
      selectValue: "",
      selectTopic: "",
      series: [],
      flag: false,
      
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      imageTooltipOpen: false,
      display1: "none",
      textinput: "",
    };
  }


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


  yearhandleChange = (e) =>{
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


  selectYearsRange = (e) =>{
    fetch(BASE_URL_CONFERENCE + "getSharedYears/?" + this.state.selectedConferences.join("&"))
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        this.setState({
          active1: true,
          active2: false,
          words: json.years.sort((a, b) => (a.label > b.label ? 1 : -1)),
          selectedConferences: this.state.selectedConferences,
        });
      });

  }


  selectSharedTopics = (e) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/topic/"+this.state.selectValue+"/?" + this.state.selectedConferences.join("&"))
    .then((response) => response.json())
    .then((json) => {
      var series = [];
      console.log(json.Topiclist[0]);
      for (let i = 0; i < json.Topiclist[0].length; i++) {
        series = series.concat([
          {name: json.Topiclist[0][i].word, data: json.Topiclist[0][i].weight},
        ]);
        //selectInputRef1.current.chart.publicMethods.updateOptions({})
      }
      this.setState({
        active1: false,
        active2: true,
        active3: true,
        active4: false,
        opacity: 1,
        series: series,

        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: true,
            },
            zoom: {
              enabled: true,
            },
          },

          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },

          xaxis: {
            categories: json.Topiclist[1],
          },
          yaxis: {
            title: {
              text: undefined,
            },
            labels: {
              style: {
                fontWeight: 700,
              },
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "left",
            offsetX: 40,
          },
        },
        years: json.Topiclist[1],
        isLoaded: true,
      });
    });
  }




  selectSharedKeywords = (e) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/keyword/"+this.state.selectValue+"/?" + this.state.selectedConferences.join("&"))
    .then((response) => response.json())
    .then((json) => {
      var series = [];
      console.log(json.Topiclist[0]);
      for (let i = 0; i < json.Topiclist[0].length; i++) {
        series = series.concat([
          {name: json.Topiclist[0][i].word, data: json.Topiclist[0][i].weight},
        ]);
        //selectInputRef1.current.chart.publicMethods.updateOptions({})
      }
      this.setState({
        active1: false,
        active2: true,
        active3: true,
        active4: false,
        opacity: 1,
        series: series,

        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            stackType: "100%",
            toolbar: {
              show: true,
            },
            zoom: {
              enabled: true,
            },
          },

          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },

          xaxis: {
            categories: json.Topiclist[1],
          },
          yaxis: {
            title: {
              text: undefined,
            },
            labels: {
              style: {
                fontWeight: 700,
              },
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "left",
            offsetX: 40,
          },
        },
        years: json.Topiclist[1],
        isLoaded: true,
      });
    });
  }




  checkIfMounted = ()=> {
    console.log("mount");
    return this.selectInputRef1.current != null;
  }

  
  

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };

  onClear = () => {
    console.log(this.selectInputRef.current.select.state.selectValue);
    if (this.selectInputRef.current.select.state.selectValue == "") {
      console.log("set");
    } else {
      this.selectInputRef.current.select.clearValue();
    }
    this.setState({
      active3: false,
      active4: true,
      opacity: "0",
    });
  }


        

  render() {
    const checkmount = this.checkIfMounted;
    var {
      active2,
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
              This chart displays the evolution of a topic/keyword over all
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
            <br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectYearsRange}
              >
                get shared years
              </Button>
            <br/>
            <br/>
              <Label>Select a year</Label>
              <br/>
              <div style={{width: "250px"}}>
              <Select
                placeholder="Select conference"
                options={words}
                value={words.find((obj) => obj.value === selectTopic)}
                onChange={this.yearhandleChange}
             />
                </div>
            <br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectSharedTopics}
              >
                Compare Topics
              </Button>
              <Button
                outline
                color="primary"
                value="key"
                active={active2}
                onClick={this.selectSharedKeywords}
              >
                Compare Keywords
              </Button>
              
              <Button
                outline
                active={active4}
                color="primary"
                onClick={this.onClear}
              >
                Reset
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
              options={this.state.options}
              series={this.state.series}
              type="bar"
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
              This chart displays the evolution of a topic/keyword over all
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
            <br/>
              <Button
                outline
                color="primary"
                active={active1}
                value="topic"
                onClick={this.selectYearsRange}
              >
                get shared years
              </Button>

              <br/>
            <br/>
              <Label>Select a year</Label>
              <br/>
              <div style={{width: "250px"}}>
              <Select
                placeholder="Select conference"
                options={words}
                value={words.find((obj) => obj.value === selectTopic)}
                onChange={this.yearhandleChange}
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
                Compare Topics
              </Button>
              <Button
                outline
                color="primary"
                value="key"
                active={active2}
                onClick={this.selectSharedKeywords}
              >
               Compare Keywords
              </Button>

              <Button
                outline
                active={active4}
                color="primary"
                onClick={this.onClear}
              >
                Reset
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

export default CompareStackedBarChart;
