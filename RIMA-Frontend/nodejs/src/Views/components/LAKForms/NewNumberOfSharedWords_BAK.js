// Implemented By Abdallah
import React, {Component} from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import "d3-transition";
import {Button, Label, FormGroup, Form} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";



class NewNumberOfSharedWords extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      mulitSelectDefaultValues : [{value: 'lak', label: 'lak'},{value: 'edm', label: 'edm'}],
      selectedConferences:["lak","aied","edm"],
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
        series: [{
          name: 'Topics',

          data: [3, 4, 4, 5, 5, 5, 4, 3, 4, 4]
        }, {
          name: 'Keyowrds',
          data: [4, 5, 6, 8, 7, 7, 6, 4, 10, 5]
        },
        //  {
        //   name: 'bbbbb',
        //   type: 'column',
        //   data: [2, 3.3, 4, 5, 5.5]
        // },
        //  {
        //   name: 'Similarity',
        //   type: 'line',
        //   data: [20, 29, 37, 36, 44, 45, 50, 58]
        // }
      ],
        options: {
          chart: {
            height: 350,
            type: 'bar',
            stacked: false,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                this.setState({options:{...this.state.options,}})
                console.log("mark is clickable");
                console.log(chartContext, config);
              }
            }  
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [1, 1, 4]
          },
          // title: {
          //   text: 'XYZ - Stock Analysis (2009 - 2016)',
          //   align: 'left',
          //   offsetX: 110
          // },
          xaxis: {
            categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
          },
          yaxis: [
            {
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#008FFB'
              },
              labels: {
                style: {
                  colors: '#008FFB',
                }
              },
              title: {
                text: "",
                style: {
                  color: '#008FFB',
                }
              },
              tooltip: {
                enabled: true
              }
            },
            {
              seriesName: 'Topics',
              opposite: true,
              axisTicks: {
                show: true,
              },
              axisBorder: {
                show: true,
                color: '#00E396'
              },
              labels: {
                style: {
                  colors: '#00E396',
                }
              },
              title: {
                text: "",
                style: {
                  color: '#00E396',
                }
              },
            },
          ],
          tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
              offsetY: 30,
              offsetX: 60
            },
          },
          legend: {
            horizontalAlign: 'left',
            offsetX: 40
          }
        },
      
      
      };
      
    
    }
    wordhandleChange = (e) =>{
      console.log(e.value)
      this.setState({
        selectValue: e
      })
      console.log(this.state.selectValue)
  
  
    }
  
    conferenceshandleChange = (e) => {
      const value = Array.isArray(e) ? e.map((s) => s.value) : [];
  
      console.log("Abdo")
      console.log(value);
      console.log("Abdo")
  
  
      this.setState({
        selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
        selectedConferences: value,
      }, function(){
        this.CompareSharedWordNumber();
      });
  
      console.log("BAB")
      console.log(this.state.selectedConferences);
      console.log("BAB")
    }
  
  
  
    selectSharedTopics = (e) => {
      this.setState({
        active1: true,
        active2: false,
        key: "topic",
      });
    }
  
  
    selectSharedKeywords = (e) => {
      this.setState({
        active1: false,
        active2: true,
        key: "keyowrd",
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
  
    CompareSharedWordNumber =() => {
      var {series} = this.state;
      var {weights} =  this.state;
      fetch(
          BASE_URL_CONFERENCE +
          "getSharedWordsNumber/"  +
          "?" +
          this.state.selectedConferences.join("&")  
        )
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            console.log("I am here 2 ")
            series = [];
            weights = [];
            console.log("I am here AFTER ")
            for (let index = 0; index < 2; index++ ){
              console.log(index);
              for (let i = 0; i < json.weights.length; i++) {
                  weights[i] = json.weights[i][index]
              }
              console.log("I am here 3 ")
              if (index == 0){
                  series = series.concat([
                  {name: 'Topics', data: weights, }]);
                  } else {
                  series = series.concat([
                  {name: 'keywords', data: weights, }]);
               }   
              console.log("weights", weights);
              weights = [];
              
          }
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
                ... this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.years,
                }
               },
              
              loader: false,
              opacity: "0.9",
            });
          });
      }
  

  render() {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
              <br></br>
            <h2>Shared topics and keywords evolution</h2>

              <p>
              The evolution of the number of shared topics and keywords between conferences.
              </p>
            <div style={{width: "100%"}}>
            <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select conferences to compare"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find((obj) => obj.value === this.state.selectConference)}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}

            />

            </div>
              <br/>
              {this.state.words.length == 0  && !this.state.active4 ? (
                <div style={{color: 'red'}}>No common words found</div>

              ) : (<div/>)}
              <div
                style={{
                  marginLeft: "300px",
                  marginTop: "100px",
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
              height={350}
            />
          </div>
        </div>
      );
    } 
}

export default NewNumberOfSharedWords;