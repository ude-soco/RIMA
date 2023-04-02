// Implemented By Abdallah
import React, {Component,useEffect, useState} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form, Row, Col,Fade} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


class NewCompareStackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef(); //question
    this.selectInputRef1 = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'edm', label: 'edm'}],
      selectConference:"",
      selectedEventThree: "",
      selectedConferences:[],
      checkThird: false,
      checkThird2: true,
      confevents:[],
      confeventsTwo: [],
      confeventsThree:[],
      years:[
        {
            value: "2020",
            label: "2020"
        },
        {
            value: "2013",
            label: "2013"
        },
        {
            value: "2017",
            label: "2017"
        },
        {
            value: "2015",
            label: "2015"
        },
        {
            value: "2018",
            label: "2018"
        },
        {
            value: "2011",
            label: "2011"
        },
        {
            value: "2019",
            label: "2019"
        }
    ],
      weights : [],
      key: "",


      series: [
        {
          name: "student",
          data: [217, 172]
        },
        {
          name: "students",
          data: [162, 114]
        },
        {
          name: "learning",
          data  : [287, 143]
        },
        {
          name: "model",
          data: [100, 81]
        },
        {
          name: "data",
          data: [107, 69]
        }
    ],
        
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
        categories: [
          "lak2020",
          "edm2020"
      ],
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

      loader: false,
      display: "none",
      opacity: "0.9",
      selectValue: {value: '2020', label: '2020'},
      selectTopic: "",

      
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      imageTooltipOpen: false,
    };
  }


  conferenceshandleChange= (e) => {
    console.log("here chooseeen 1")
    this.setState({
      selectedConferences: e.value,
      selectedConferences2: e,
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
      selectedEvent2: e,

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
  
  conferenceshandleChangeThree = (e) =>{
    console.log("second seleeeeect on change")
    this.setState({
      selectedConferencesThree: e.value,
    }, function() {
      this.selectConfEventThree(this.state.selectedConferencesThree);
    });

    console.log("choosen conf i ", this.state.selectedConferencesThree)


  }

  selectConfEventThree = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
    .then((response) => response.json())
    .then((json) => {
      this.setState({
      confeventsThree  : json.events

    });
    });
  }

  setSelectedEventThree = (e) => {
    this.setState({
      selectedEventThree: e.value,
      isLoading: true,
    });
    console.log("here chooseeen 3i")
    console.log("here chooseeen 3i", e)

    console.log("choosen event 3i", this.state.selectedEventThree)
  }  



  selectSharedWords = (val) => {
    if (this.state.selectedEventThree == "" || this.state.checkThird === false){
      fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/" + val + "/" + this.state.selectedEvent + "/" + this.state.selectedEventTwo)
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        console.log(json.Topiclist[0]);
        for (let i = 0; i < json.Topiclist[0].length; i++) {
          series = series.concat([
            {name: json.Topiclist[0][i].word, data: json.Topiclist[0][i].weight},
          ]);
        }
  
  
        if (val == "topic") {
          this.setState({
            active1: true,
            active2: false,
            active3: false,
            active4: false,
            opacity: 1,
            series: series,
    
            options: {
              ... this.state.options,
              xaxis: {
                ...this.state.options.xaxis,
                categories: json.Topiclist[1],
              }
             },
          });
        }else{
          this.setState({
            active1: false,
            active2: true,
            active3: false,
            active4: false,
            opacity: 1,
            series: series,
            options: {
              ... this.state.options,
              xaxis: {
                ...this.state.options.xaxis,
                categories: json.Topiclist[1],
              }
             },
          });
        }
  
        
      });
    }
    else{ 
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/" + val + "/" + this.state.selectedEvent + "/" + this.state.selectedEventTwo + "/" + this.state.selectedEventThree)
    .then((response) => response.json())
    .then((json) => {
      var series = [];
      console.log(json.Topiclist[0]);
      for (let i = 0; i < json.Topiclist[0].length; i++) {
        series = series.concat([
          {name: json.Topiclist[0][i].word, data: json.Topiclist[0][i].weight},
        ]);
      }


      if (val == "topic") {
        this.setState({
          active1: true,
          active2: false,
          active3: false,
          active4: false,
          opacity: 1,
          series: series,
  
          options: {
            ... this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.Topiclist[1],
            }
           },
        });
      }else{
        this.setState({
          active1: false,
          active2: true,
          active3: false,
          active4: false,
          opacity: 1,
          series: series,
          options: {
            ... this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.Topiclist[1],
            }
           },
        });
      }

      
    });
  }
  }



  selectSharedKeywords = (e) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/keyword/"+this.state.selectedEvent +this.state.selectedEventTwo + this.state.selectedEventThree)
    .then((response) => response.json())
    .then((json) => {
      var series = [];
      console.log(json.Topiclist[0]);
      for (let i = 0; i < json.Topiclist[0].length; i++) {
        series = series.concat([
          {name: json.Topiclist[0][i].word, data: json.Topiclist[0][i].weight},
        ]);
      }
      this.setState({
        active1: false,
        active2: true,
        active3: false,
        active4: false,
        opacity: 1,
        series: series,
        options: {
          ... this.state.options,
          xaxis: {
            ...this.state.options.xaxis,
            categories: json.Topiclist[1],
          }
         },
      });
    });
  }
   changeBackgroundh=(e) => {
    e.target.style.background = '#B0D4FF';
  }
   changeBackgroundh2=(e) => {
    e.target.style.background = "#F5F5F2";
    if(this.state.checkThird === true){
      e.target.style.background = '#B0D4FF';
    }
    else {
      e.target.style.background = '#F5F5F2';
    }
  }
  changeBackgroundhh2=(e) =>  {
    e.target.style.background = "#F5F5F2";
    if(this.state.checkThird2 === true){
      e.target.style.background = '#B0D4FF';
    }
    else {
      e.target.style.background = '#F5F5F2';
    }
}
 handleClickh =(e) => {
  if (this.state.checkThird === true){
  this.setState({
    checkThird: false,
  });
  }
  else{
    this.setState({
      checkThird: true,
    });
  }
  if (this.state.checkThird2 === true){
    this.setState({
      checkThird2: false,
    });
    }
    else{
      this.setState({
        checkThird2: true,
      });
    }
 }
 handleClickh2 =(e) => {
  if (this.state.checkThird2 === true){
  this.setState({
    checkThird2: false,
  });
  }
  else{
    this.setState({
      checkThird2: true,
    });
  }
 }
  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };
  handleToogle2 = (status) => {
    this.setState({imageTooltipOpen2: status});
    console.log(this.state.imageTooltipOpen2);
  };

  onClear = () => {

    this.setState({
      active1: false,
      active2: false,
      active3: false,
      active4: true,
      selectedConferences:[],
      years : [],
      selectValue : "",
      opacity: "0",
    });

    this.selectInputRef.current.select.clearValue();

  }


        

  render() {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
            <h2>Popularity of shared topics and keywords</h2>
              <p>
              Popularity percentages of the shared topics and keywords between conference events.
              </p>


            <Label style={{marginRight : "5%"}}>Select conference events</Label> 

            <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle2(true)}
                onMouseOut={() => this.handleToogle2(false)}
              />
              {this.state.imageTooltipOpen2 && (
                <div
                  className="imgTooltip"
                  style={{
                    marginTop: "0px",
                    position: "relative",
                    left: "100px",
                    width: "400px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    {" "}
                    This visualization is comparing shared topics/keywords between conference events, so you have to select at least 2 conferece events to compare.

                  </p>
                </div>
              )}
 
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

               <br/>  
          <div checked={this.state.checkThird2} onMouseEnter={this.changeBackgroundh} onMouseLeave={this.changeBackgroundh2} onClick={this.handleClickh2}>
                <Fade unmountOnExit in={this.state.checkThird2}>
              <h4 checked={this.state.checkThird} onMouseEnter={this.changeBackgroundh} onMouseLeave={this.changeBackgroundh2} onClick={this.handleClickh}> + Add third event </h4>
              </Fade>
              </div>                       
               <Fade unmountOnExit in={this.state.checkThird}> 

            <Row>
              <Col>

                <Select
                  placeholder="Third conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConferenceThree)}
                  onChange ={this.conferenceshandleChangeThree}
                 />
              </Col>

              <Col>

                <Select
                  placeholder="Third conference event"
                  options={this.state.confeventsThree}
                  value={this.state.confeventsThree.find((obj) => obj.value === this.state.selectedEventThree)}
                  onChange ={this.setSelectedEventThree}
                />
                                </Col>
                                </Row>

                <br/>
                <h4 checked={this.state.checkThird} onMouseEnter={this.changeBackgroundh} onMouseLeave={this.changeBackgroundhh2} onClick={this.handleClickh}> - Shrink third event </h4>

    </Fade>
            <br/>
            {/* {this.state.years.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common years found</div>

              ) : (<div/>)}
            <br/> */}
              <Button
                outline
                color="primary"
                active={this.state.active1}
                value="topic"
                onClick={() => this.selectSharedWords("topic")}
              >
                Topics
              </Button>
              <Button
                outline
                color="primary"
                value="keyword"
                active={this.state.active2}
                onClick={() => this.selectSharedWords("keyword")}
              >
                Keywords
              </Button>
              
              {/* <Button
                outline
                active={this.state.active4}
                color="primary"
                onClick={this.onClear}
              >
                Reset
              </Button> */}
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
          
              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <div style={{backgroundColor: "white", display: this.state.display}}>
                  <Loader
                    type="Bars"
                    visible={this.state.loader}
                    color="#00BFFF"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            </FormGroup>
          </Form>
          <div style={{opacity: this.state.opacity}}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={400}
            />
          </div>
        </div>
      );
    } 
  }


export default NewCompareStackedBarChart;
