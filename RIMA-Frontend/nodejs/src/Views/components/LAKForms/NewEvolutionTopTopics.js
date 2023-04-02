// Implemented By Abdallah
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form, Row, Col} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";



class NewEvolutionTopTopics extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'aied', label: 'aied'},{value: 'edm', label: 'edm'}],
      selectedConferences:[],
      active1: false,
      active2: false, 
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
        topWords : [],
        series: [{
            name: "Data",
            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
          },
          {
            name: "Students",
            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
          },
          {
            name: 'Online',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
          },
          {
            name: 'Learning',
            data: [ 91, 159, 181, 252, 305, 212, 130, 168, 268, 100]
          },
          {
            name: 'Analysis',
            data: [ 120, 339, 100, 291, 110, 203, 325, 282, 298, 80]
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            },
          },
          yaxis: [
            {title: {
              text: "Weight",
              style: {
                color: '#008FFB',
              }
            },}
          ],
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
          },
          // title: {
          //   text: 'Page Statistics',
          //   align: 'left'
          // },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
          },
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: ["2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"],
          },
          tooltip: {
            y: [
              {
                title: {
                  formatter: function (val) {
                    return val + " (mins)"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val + " per session"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              }
            ]
          },
          grid: {
            borderColor: '#f1f1f1',
          }
        },
      
      
      };
    }
    handleToogle = (status) => {
      this.setState({imageTooltipOpen: status});
      console.log(this.state.imageTooltipOpen);
    };
    conferenceshandleChange = (e) =>{
      this.setState({
        selectedConferences: e.value,
        isLoading: true,
      });
      console.log("here chooseeen")
      console.log("here chooseeen", e)

      console.log("choosen conf ", this.state.selectedConferences)
    }
    
    topKeywordsInInYears = () => {
      fetch(BASE_URL_CONFERENCE + "topTopicsInYears/" + this.state.selectedConferences + "/"+ "keyword")
      .then((response) => response.json())
      .then((json) => {
        var topWords = json.WordsList.slice(5,10);
        console.log("I am heeeeeeeeere gded", topWords)
        console.log("I am heeeeeeeeere gded unclised", json.WordsList)
        console.log("I am heeeeeeeeere sliced ", json.WordsList.slice(0,5))

        this.setState({ 
          topWords : json.WordsList.slice(5,10)
        }, function(){
          this.getEvolutionOfWords(this.state.topWords);
        });
        console.log("I am heeeeeeeeere gded unclised", this.state.topWords)
      });  }

      getEvolutionOfWords = (selectedValues) => {
        console.log("the coming data", selectedValues)
        fetch(
          BASE_URL_CONFERENCE +
          "getallkeysevolution/keyword/" + this.state.selectedConferences +"/" +
          "?" +
          selectedValues.join("&")  
        )
          .then((response) => response.json())
          .then((json) => {
            console.log("json", json); 
            var series = [];
            for (let i = 0; i < json.weights.length; i++) {
              series = series.concat([
                {name: selectedValues[i], data: json.weights[i]},
              ]);
            }      
            this.setState({ 
              active1: false,
              active2: true,
              series: series,
              options: {...this.state.options,
                xaxis: {...this.state.options.xaxis,
                categories: json.years}}  
            });     
          });
      } 
      topTopicsInYears = () => {
        fetch(BASE_URL_CONFERENCE + "topTopicsInYears/" + this.state.selectedConferences + "/"+ "topic")
        .then((response) => response.json())
        .then((json) => {
          var topWords = json.WordsList.slice(5,10);
          console.log("I am heeeeeeeeere gded", topWords)
          console.log("I am heeeeeeeeere gded unclised", json.WordsList)
          console.log("I am heeeeeeeeere sliced ", json.WordsList.slice(0,5))
  
          this.setState({ 
            topWords : json.WordsList.slice(5,10)
          }, function(){
            this.getEvolutionOfTopics(this.state.topWords);
          });
          console.log("I am heeeeeeeeere gded unclised", this.state.topWords)
        });  }
  
        getEvolutionOfTopics = (selectedValues) => {
          console.log("the coming data", selectedValues)
          fetch(
            BASE_URL_CONFERENCE +
            "getalltopicsevolution/topic/" + this.state.selectedConferences +"/" +
            "?" +
            selectedValues.join("&")  
          )
            .then((response) => response.json())
            .then((json) => {
              console.log("json", json); 
              var series = [];
              for (let i = 0; i < json.weights.length; i++) {
                series = series.concat([
                  {name: selectedValues[i], data: json.weights[i]},
                ]);
              }      
              this.setState({
                active1: true,
                active2: false,  
                series: series,
                options: {...this.state.options,
                  xaxis: {...this.state.options.xaxis,
                  categories: json.years}} 
              });     
            });
        } 

      render() {
        return (
          <div id="chart" className="box">
             <Form role="form" method="POST">
              <FormGroup>
              <h2>Evolution of most popular topics and keywords</h2>

                <p>
                The evolution of the most popular five topics and keywords of a conference.
                </p>

            <Row>
              <Col>
              <Select
                  placeholder="Select a conference"
                  options={this.props.conferencesNames}
                  value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                  onChange ={this.conferenceshandleChange}
                />
                  </Col>
              <Button
                  outline
                  color="primary"
                  active={this.state.active1}
                  value="topic"
                  onClick={this.topTopicsInYears}
                >
                  Topics 
                </Button>
                <Button
                  outline
                  color="primary"
                  active={this.state.active2}
                  value="key"                
                  onClick={this.topKeywordsInInYears}
                >
                  Keywords
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
                    position: "absolute",
                    marginLeft: "30%",
                    left: "2px",
                    width: "400px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    {" "}
                    The evolution of the top five topics/keywords in the last 5 years of a selected conference.
                  </p>
                </div>
              )}
                </Row>
              </FormGroup>
            </Form> 
          <div style={{opacity: this.state.opacity}}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="line"
              height={350}
            />
          </div>
        </div>
      );
    } 
}

export default NewEvolutionTopTopics;
