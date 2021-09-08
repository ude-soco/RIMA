import React, {Component,useEffect} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


class CompareStackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.selectInputRef1 = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'aied', label: 'aied'},{value: 'edm', label: 'edm'}],
      selectConference:"",
      selectedConferences:["lak","aied","edm"],
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
          data: [217, 172, 162,459]
        },
        {
          name: "students",
          data: [162, 114, 115, 255]
        },
        {
          name: "learning",
          data  : [287, 143, 155, 268]
        },
        {
          name: "model",
          data: [100, 81, 108, 203]
        },
        {
          name: "data",
          data: [107, 69, 60, 246]
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
          "aied2020-1",
          "aied2020-2",
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
      active2: true,
      active3: false,
      active4: false,
      imageTooltipOpen: false,
    };
  }

  
  yearhandleChange = (e) =>{
    console.log(e)
    this.setState({
      selectValue: e
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
        if(json.years.length == 0)
          {
            this.state.selectValue = "";

            this.setState({
              series: [],
              options: {
                ... this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: [],
                }
              },
              });
          }

        this.setState({
          active1: false,
          active2: false,
          active3 : true,
          years: json.years.sort((a, b) => (a.label > b.label ? 1 : -1)),
          selectedConferences: this.state.selectedConferences,
          });
      });
      
  }


  selectSharedWords = (val) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/"+val+"/"+this.state.selectValue.value+"/?" + this.state.selectedConferences.join("&"))
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




  selectSharedKeywords = (e) => {
    fetch(BASE_URL_CONFERENCE + "getSharedWordsBar/keyword/"+this.state.selectValue.value+"/?" + this.state.selectedConferences.join("&"))
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


  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
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
            <h2>Popularity of topics/keywords in Conferences over time</h2>
              <br/>
              <p>
              This chart compares the popularity percentages of the shared topics/keywords over a specific shared year of the selected conferences
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
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectTopic)}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}


            />

            </div>
            <br/>
              <Button
                outline
                color="primary"
                active={this.state.active3}
                value="topic"
                onClick={this.selectYearsRange}
              >
                get shared years
              </Button>
            <br/>
            {this.state.years.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common years found</div>

              ) : (<div/>)}
            <br/>
              <Label>Select a year</Label>
              <br/>
              <div style={{width: "250px"}}>
              <Select
                placeholder="Select conference"
                options={this.state.years}
                value={this.state.selectValue}
                onChange={this.yearhandleChange}
             />
            </div>
            <br/>
              <Button
                outline
                color="primary"
                active={this.state.active1}
                value="topic"
                onClick={() => this.selectSharedWords("topic")}
              >
                Compare Topics
              </Button>
              <Button
                outline
                color="primary"
                value="keyword"
                active={this.state.active2}
                onClick={() => this.selectSharedWords("keyword")}
              >
                Compare Keywords
              </Button>
              
              <Button
                outline
                active={this.state.active4}
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
              height={350}
            />
          </div>
        </div>
      );
    } 
  }


export default CompareStackedBarChart;
