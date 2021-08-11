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



class CompareTimeLineChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        conferencesNames:[],
        selectedConferences:[],
        active1: false,
        active2: false,
        active4: false,
        selectTopic: "",
        opacity: "0.9",
        
        series: [
          {
            name: 'lak', 
            data: [
              {
                x: 'Learning',
                y: [
                    new Date('2011').getTime(),
                    new Date('2011-12-31').getTime()
                  ]
              }, 
              {
                x: 'Analytic',
                y: [
                  new Date('2011').getTime(),
                  new Date('2011-12-31').getTime()
                ]
              },
              {
                x: 'Analytics',
                y: [
                  new Date('2011').getTime(),
                  new Date('2011-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2011').getTime(),
                  new Date('2011-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2011').getTime(),
                  new Date('2011-12-31').getTime()
                ]
              },
              {
                x: 'Learning',
                y: [
                  new Date('2012').getTime(),
                  new Date('2012-12-31').getTime()
                ]
              },
              {
                x: 'Analytics',
                y: [
                  new Date('2012').getTime(),
                  new Date('2012-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2012').getTime(),
                  new Date('2012-12-31').getTime()
                ]
              },
              {
                x: 'Learning analytics', 
                y: [
                  new Date('2012').getTime(),
                  new Date('2012-12-31').getTime()
                ]
              },
              {
                x: 'Social',
                y: [
                  new Date('2012').getTime(),
                  new Date('2012-12-31').getTime()
                ]
              },
              {
                x: 'Analytics',
                y: [
                  new Date('2013').getTime(),
                  new Date('2013-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2013').getTime(),
                  new Date('2013-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2013').getTime(),
                  new Date('2013-12-31').getTime()
                ]
              },
              {
                x: 'Learning analytics',
                y: [
                  new Date('2013').getTime(),
                  new Date('2013-12-31').getTime()
                ]
              },
              {
                x: 'Paper',
                y: [
                  new Date('2013').getTime(),
                  new Date('2013-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
               y: [
                new Date('2014').getTime(),
                new Date('2014-12-31').getTime()
              ]
              }, 
              {
                x: 'Student',
                y: [
                  new Date('2014').getTime(),
                  new Date('2014-12-31').getTime()
                ]
              }, 
              {
                x: 'Analytics',
                y: [
                  new Date('2014').getTime(),
                  new Date('2014-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning analytics',
                y: [
                  new Date('2014').getTime(),
                  new Date('2014-12-31').getTime()
                ]
              },
              {
                x: 'Data', 
                y: [
                  new Date('2014').getTime(),
                  new Date('2014-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2015').getTime(),
                  new Date('2015-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2015').getTime(),
                  new Date('2015-12-31').getTime()
                ]
              }, 
              {
                x: 'Data',
                y: [
                  new Date('2015').getTime(),
                  new Date('2015-12-31').getTime()
                ]
              },
              {
                x: 'Analytics', 
                y: [
                  new Date('2015').getTime(),
                  new Date('2015-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning analytics',
                y: [
                  new Date('2015').getTime(),
                  new Date('2015-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2016').getTime(),
                  new Date('2016-12-31').getTime()
                ]
              }, 
              {
                x: 'Student',
                y: [
                  new Date('2016').getTime(),
                  new Date('2016-12-31').getTime()
                ]
              },
              {
                x: 'Analytics',
                y: [
                  new Date('2016').getTime(),
                  new Date('2016-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2016').getTime(),
                  new Date('2016-12-31').getTime()
                ]
              },
              {
                x: 'Learning analytics',
                y: [
                  new Date('2016').getTime(),
                  new Date('2016-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2017').getTime(),
                  new Date('2017-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2017').getTime(),
                  new Date('2017-12-31').getTime()
                ]
              },
              {
                x: 'Analytics',
                y: [
                  new Date('2017').getTime(),
                  new Date('2017-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2017').getTime(),
                  new Date('2017-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning analytics',
                y: [
                  new Date('2017').getTime(),
                  new Date('2017-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2018').getTime(),
                  new Date('2018-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2018').getTime(),
                  new Date('2018-12-31').getTime()
                ]
              }, 
              {
                x: 'Analytics',
                y: [
                  new Date('2018').getTime(),
                  new Date('2018-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y:[
                  new Date('2018').getTime(),
                  new Date('2018-12-31').getTime()
                ]
              },
              {
                x: 'Learning analytics',
                y: [
                  new Date('2018').getTime(),
                  new Date('2018-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y:[
                  new Date('2019').getTime(),
                  new Date('2019-12-31').getTime()
                ]
              },
              {
                x: 'Learning',
                y: [
                  new Date('2019').getTime(),
                  new Date('2019-12-31').getTime()
                ]
              },
              {
                x: 'Model',
                y: [
                  new Date('2019').getTime(),
                  new Date('2019-12-31').getTime()
                ]
              }, 
              {
                x: 'Data',
                y: [
                  new Date('2019').getTime(),
                  new Date('2019-12-31').getTime()
                ]
              }, 
              {
                x: 'Analytics',
                y: [
                  new Date('2019').getTime(),
                  new Date('2019-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2020').getTime(),
                  new Date('2020-12-31').getTime()
                ]
              }, 
              {
                x: 'Student',
                y: [
                  new Date('2020').getTime(),
                  new Date('2020-12-31').getTime()
                ]
              },
              {
                x: 'Data',
                y: [
                  new Date('2020').getTime(),
                  new Date('2020-12-31').getTime()
                ]
              },
              {
                x: 'Model',
                y: [
                  new Date('2020').getTime(),
                  new Date('2020-12-31').getTime()
                ]
              }, 
              {
                x: 'Analytics',
                y: [
                  new Date('2020').getTime(),
                  new Date('2020-12-31').getTime()
                ]
              }, 
              {
                x: 'Learning',
                y: [
                  new Date('2021').getTime(),
                  new Date('2021-12-31').getTime()
                ]
              },
              {
                x: 'Student',
                y: [
                  new Date('2021').getTime(),
                  new Date('2021-12-31').getTime()
                ]
              },
              {
                x: 'Data', 
                y: [
                  new Date('2021').getTime(),
                  new Date('2021-12-31').getTime()
                ]
              },
              {
                x: 'Model',
                y: [
                  new Date('2021').getTime(),
                  new Date('2021-12-31').getTime()
                ]
              }, 
              {
                x: 'Analytics',
                y: [
                  new Date('2021').getTime(),
                  new Date('2021-12-31').getTime()
                ]
              }
            ]
          }
        ],

        options: {
          chart: {
            height: 450,
            type: 'rangeBar'
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '80%'
            }
          },
          xaxis: {
            type: 'datetime'
          },
          stroke: {
            width: 1
          },
          fill: {
            type: 'solid',
            opacity: 0.6
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          }
        },
      
      
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

  conferenceshandleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    });
  }


  selectData = (e) =>{
    fetch(BASE_URL_CONFERENCE + "getDataTimeLineChart/topic/?" + this.state.selectedConferences.join("&"))
    .then((response) => response.json())
    .then((json) => {

      for(var index= 0; index < json.data.length; index++){
        var inner_list = json.data[index];
        for(var inner =0 ; inner < inner_list['data'].length; inner++){
          inner_list['data'][inner]['y'][0] = new Date(inner_list['data'][inner]['y'][0]).getTime()
          inner_list['data'][inner]['y'][1] = new Date(inner_list['data'][inner]['y'][1]).getTime()
        }
      }
      this.setState({
        series : json.data
      });
    });
  } 

  onClear = (e) =>{
  }

    render() {
      return (
        <div id="chart" className="box">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Timeline of topics/keywords in Conferences over time</h2>
              <br/>
              <p>
              This chart displays the timeline of the top five topics/keywords over all
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
                options={this.state.conferencesNames}
                value={this.state.conferencesNames.find((obj) => obj.value === this.state.selectedConferences)}
                onChange={this.conferenceshandleChange}
                defaultValue={{value: 'lak', label: 'lak'}}
            />

            </div>
            <br/>
            
            <br/>
              <Button
                outline
                color="primary"
                active={this.state.active1}
                value="topic"
                onClick={this.selectData}
              >
                Compare Topics
              </Button>
              <Button
                outline
                color="primary"
                value="key"
                active={this.state.active2}
                onClick={this.selectData}
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
            </FormGroup>
          </Form>
          <div style={{opacity: this.state.opacity}}>
            <ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={450} />
          </div>
        </div>
        



      );
    }
  }

  export default CompareTimeLineChart;