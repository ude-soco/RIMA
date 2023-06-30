// Implemented By Abdallah
import React, { Component, useEffect } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import { Button, Label, FormGroup, Form, Row, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class NewTopWordsInYears extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue1: { value: "LAK2011", label: "LAK2011" },
      selectValue2: { value: "EDM2012", label: "EDM2012" },
      active1: false,
      active2: false,
      words: [
        { value: "data", label: "data" },
        { value: "learning", label: "learning" },
        { value: "model", label: "model" },
        { value: "models", label: "models" },
        { value: "online", label: "online" },
        { value: "paper", label: "paper" },
        { value: "student", label: "student" },
        { value: "students", label: "students" },
        { value: "system", label: "system" },
        ,
      ],

      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 380,
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "bottom",
            },
          },
        },

        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#fff"],
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        xaxis: {
          categories: [
            "data",
            "learning",
            "model",
            "models",
            "online",
            "paper",
            "student",
            "students",
            "system",
            "data",
          ],
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        tooltip: {
          theme: "dark",
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: function () {
                return "";
              },
            },
          },
        },
      },
    };
  }
  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
  };

  conferenceshandleChange = (e) => {
    this.setState({
      selectedConferences: e.value,
      isLoading: true,
    });
    console.log("here chooseeen");
  };

  topKeywordsInInYears = () => {
    fetch(
      BASE_URL_CONFERENCE +
        "topTopicsInYears/" +
        this.props.selectedConferences +
        "/" +
        "keyword"
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        series = series.concat([{ data: json.values }]);
        console.log("The top words are", json);
        this.setState({
          active1: false,
          active2: true,
          series: series,
          options: {
            ...this.state.options,
            xaxis: { ...this.state.options.xaxis, categories: json.WordsList },
          },
        });
      });
  };

  topTopicsInYears = () => {
    fetch(
      BASE_URL_CONFERENCE +
        "topTopicsInYears/" +
        this.props.selectedConferences +
        "/" +
        "topic"
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        series = series.concat([{ data: json.values }]);
        console.log("The top works are", json.WordsList);
        this.setState({
          active1: true,
          active2: false,
          series: series,
          options: {
            ...this.state.options,
            xaxis: { ...this.state.options.xaxis, categories: json.WordsList },
          },
        });
      });
  };

  render() {
    return (
      <div id="chart" className="box">
        <Form role="form" method="POST">
          <FormGroup>
            <h2>Most popular topics and keywords</h2>

            <p>
              The top ten topics and keywords in the last five years of a
              conference.
            </p>
            <br></br>
            <br />
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
          </FormGroup>
        </Form>
        <div style={{ opacity: this.state.opacity }}>
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

export default NewTopWordsInYears;
