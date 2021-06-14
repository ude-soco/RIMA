import React, {Component} from "react";
import Select from 'react-select';
import {BASE_URL_CONFERENCE} from '../../../Services/constants';
import "d3-transition";
import {
  Label,
  FormGroup,
  Form,
} from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";


class LAKAreaChart extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this)
    this.state = {
      soptions: [],
      weights: [],
      years: [],
      isLoaded: false,
      isDisplayed: false,
      selectValue: "",
      series: [],
      options: {
        chart: {
          type: 'area',
          height: 350,
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'smooth'
        },

        dataLabels: {
          enabled: true,
        },
        title: {
          text: 'Topic weights',
          align: 'left'
        },
        subtitle: {
          text: 'Journey over years',
          align: 'left'
        },
      },
    };
  }

  componentDidMount() {
    fetch(BASE_URL_CONFERENCE + "/api/interests/getalltopics/")
      .then(response => response.json())
      .then(json => {
        var {items, weights} = this.state;
        this.setState({
          soptions: json.topics,
          isLoaded: true,
        })
      });
  }

  selectValue(e) {
    var selectValue = this.state.selectValue;
    var isDisplayed = this.state.isDisplayed;
    console.log("the val is:", e.value)
    selectValue = e.value;
    fetch("http://127.0.0.1:8000/api/conferences/gettopicsyearwise/" + e.value)
      .then(response => response.json())
      .then(json => {
        var {years, weights} = this.state;
        this.setState({

          weights: json.weights,
          years: json.years,
          series: [{
            name: "Topic Journey over years based on weights",
            type: "area",
            data: weights
          },
          ],
          datalabels: {
            enabled: true
          },
          options: {
            stroke: {
              curve: 'smooth'
            },
            xaxis: {
              categories: years
            },
          },
          isLoaded: true,
          isDisplayed: true
        })
      });
  }


  render() {
    var {options, isLoaded, selectValue, series, yeardata, soptions, weights, years, isDisplayed} = this.state;
    if (isLoaded) {
      return (
        <div id="chart">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>
                Journey of a topic form year to year
              </h2>
              <Label>Select a Topic</Label>
              <Select
                placeholder="Select Option"
                options={soptions}
                value={soptions.find(obj => obj.value === selectValue)}
                onChange={this.selectValue}/>
              <br/>
              <br/>
            </FormGroup>
          </Form>
          {isDisplayed ? (
              <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350}/>) :
            (null)}
        </div>)
    } else {
      return (
        <div id="chart">
          <Form role="form" method="POST">
            <FormGroup>
              <h2>
                Journey of a topic form year to year
              </h2>
              <Label>Select a Topic</Label>
              <br/>
              <br/>
            </FormGroup>
          </Form>
        </div>)
    }
  }
}

export default LAKAreaChart;
