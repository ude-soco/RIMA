// Implemented By Abdallah
import React, {Component,useEffect} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form, Row, Col, } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class NewCompareTopicsInPapers  extends Component {
  constructor(props) {
    super(props);
  this.selectInputRef = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'aied', label: 'aied'},{value: 'edm', label: 'edm'}],
      // selectedConferences:["lak","aied","edm"],
      words:[
        {value: "data", label: "data"},
        {value: "learning", label: "learning"},
        {value: "model", label: "model"},
        {value: "models", label: "models"},
        {value: "online", label: "online"},
        {value: "paper", label: "paper"},
        {value: "student", label: "student"},
        {value: "students", label: "students"},
        {value: "system", label: "system"},],
        selectedOption:"",
        weights : [],
        confevents: [],
        confeventsTwo: [],
        active1: false,
        active2: false, 
        series: [
          {
            name : 'aied2012',
            data : [ 120, 339, 100, 291, 110, 203, 325, 282, 298, 80]
          },{
            name :'edm2016',
            data :[ 91, 159, 181, 252, 305, 212, 130, 168, 268, 100]
          }],
          options: {
            Abdo: "Abdo",
            chart: {
              type: 'bar',
              height: 350,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  //console.log("mark is clickable", config.w.config.series[config.dataPointIndex]);
               //   console.log(chartContext, config);
                }
              },  
            },
            events: {
              markerClick: function(event, chartContext, opts) {
               //   console.log("mark is clickable 222", config.w.config.yaxis.categories[config.dataPointIndex]);
                console.log("Marker of value is cliked", event, chartContext)
              }
            },
            markers: {
              onClick: function() {
                console.log("Marker of value is cliked 111")
               // console.log("Marker of value is cliked", e)
              }
            }, 
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: ["data",    
              "learning",
              "model",   
              "models",  
              "online",  
              "paper",   
              "student", 
              "students",
              "system"  ],
            },
            yaxis: [
              {title: {
                text: "Number of publications",
                style: {
                  color: '#008FFB',
                }
              },}
            ],   
            tooltip: {
              y: {
                shared: false,
                intersect: true,
                formatter: function (Abdo) {
                  console.log("markers are hovered over", Abdo)
                  return  Abdo + " publications mentioned this word"
                }
              }
            }

          },

        
        };

        
      }
  conferenceshandleChange= (e) => {
    console.log("here chooseeen 1")
    this.setState({
      selectedConferences: e.value,
    }, function() {
      this.selectConfEvent(this.state.selectedConferences);
    });
    console.log("here chooseeen")

    console.log("choosen conf ", this.state.selectedConferences)
  }

  selectConfEvent = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
      confevents: json.events

    });
    });
  }

  setSelectedEvent = (e) =>{
    this.setState({
      selectedEvent: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 2")

    console.log("choosen event 2", this.state.selectedEvent)
    console.log("choosen conf of that 2", this.state.selectedConferences)
  }
  conferenceshandleChangeTwo = (e) =>{
    console.log("second seleeeeect on change")
    this.setState({
      selectedConferencesTwo: e.value,
    }, function() {
      this.selectConfEventTwo(this.state.selectedConferencesTwo);
    });
    console.log("here chooseeen i")

    console.log("choosen conf i ", this.state.selectedConferencesTwo)


  }

  selectConfEventTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
      confeventsTwo  : json.events

    });
    });
  }

  setSelectedEventTwo = (e) => {
    this.setState({
      selectedEventTwo: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 2i")

    console.log("choosen event 2i", this.state.selectedEventTwo)
  } 

  compareKeywordsInPapers = () => {
    fetch(BASE_URL_CONFERENCE + "compareWordsInPapers/" + this.state.selectedEvent 
    + "/"+ this.state.selectedEventTwo +"/" + "keyword")
    .then((response) => response.json())
    .then((json) => {
      console.log("json", json); 
      var series = [];
       series = series.concat([
        {name: this.state.selectedEvent , data: json.FirstEventValues},
        {name: this.state.selectedEventTwo , data: json.SecondEventValues},
        ]);
        this.setState({
          active1: false,
          active2: true, 
          series: series,
          options: {...this.state.options,
            xaxis: {...this.state.options.xaxis,
            categories: json.sharedWords}} 
        });         
    });  }
    //  myFunction = () => {
    //   var x = document.createElement("BUTTON");
    //   var t = document.createTextNode("Click me");
    //   x.appendChild(t);
    //   document.body.appendChild(x);
    // }
    compareTopicsInPapers = () => {
      fetch(BASE_URL_CONFERENCE + "compareWordsInPapers/" + this.state.selectedEvent 
      + "/"+ this.state.selectedEventTwo +"/" + "topic")
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json); 
        var series = [];
         series = series.concat([
          {name: this.state.selectedEvent, data: json.FirstEventValues},
          {name: this.state.selectedEventTwo, data: json.SecondEventValues},
          ]);
          this.setState({
            active1: true,
            active2: false,  
            series: series,
            options: {...this.state.options,
              xaxis: {...this.state.options.xaxis,
              categories: json.sharedWords}} 
          });         
      });  }


  render() {
      return (
        <div id="chart" className="box">
           <Form role="form" method="POST">
            <FormGroup>
            <h2>Popularity of topics and keywords in conferences publications</h2>
              <p>
              Number of publications mentioning shared topics and keywords between conference events
              </p>
          <Label>Select two conference events to compare</Label>
          <Row>
            <Col>
            <Select
                  placeholder="First conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                  onChange ={this.conferenceshandleChange}
                />
            </Col>
            <Col>
            <Select
                  placeholder="First conference event "
                  options={this.state.confevents}
                  value={this.state.confevents.find((obj) => obj.value === this.state.selectedEvent)}
                  onChange ={this.setSelectedEvent}
                />
              </Col>  

          </Row>
          <br/> 
          <Row>
          <Col>
          <Select
                  placeholder="Second conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConferenceTwo)}
                  onChange ={this.conferenceshandleChangeTwo}
                 />
            </Col>
              <Col>
              <Select
                  placeholder="Second conference event"
                  options={this.state.confeventsTwo}
                  value={this.state.confeventsTwo.find((obj) => obj.value === this.state.selectedEventTwo)}
                  onChange ={this.setSelectedEventTwo}

                />
              </Col>
            </Row>



                {/*

            {this.state.years.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common years found</div>

              ) : (<div/>)}
              

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
          */}
              <br/>

              <Button
                outline
                active={this.state.active1}
                color="primary"
                onClick={this.compareTopicsInPapers}
              >
                Topics
              </Button>
              <Button
                outline
                active={this.state.active2}
                color="primary"
                onClick={this.compareKeywordsInPapers}
              >
                Keywords
              </Button>
              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "20px",
                  position: "absolute",
                }}
              >
                {/* <div style={{backgroundColor: "white", display: this.state.display}}>
                  <Loader
                    type="Bars"
                    visible={this.state.loader}
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div> */}
              </div>
            </FormGroup>
          </Form> 
          <div style={{opacity: this.state.opacity}}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={300}
            />
          </div>
        </div>
      );
    } 
  }


export default NewCompareTopicsInPapers;
