// Updated By Islam Abdelghaffar
import React, { Component, useEffect } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Grid, Box, InputLabel } from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";

class NewCompareTopicsInPapers extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      loader: false,
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "aied", label: "aied" },
        { value: "edm", label: "edm" },
      ],
      // selectedConferences:["lak","aied","edm"],
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
      ],
      selectedOption: "",
      weights: [],
      confevents: [],
      confeventsTwo: [],
      active1: false,
      active2: false,
      series: [
        {
          name: "aied2012",
          data: [120, 339, 100, 291, 110, 203, 325, 282, 298, 80],
        },
        {
          name: "edm2016",
          data: [91, 159, 181, 252, 305, 212, 130, 168, 268, 100],
        },
      ],
      options: {
        Abdo: "Abdo",
        chart: {
          type: "bar",
          height: 350,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              //console.log("mark is clickable", config.w.config.series[config.dataPointIndex]);
              //   console.log(chartContext, config);
            },
          },
        },
        events: {
          markerClick: function (event, chartContext, opts) {
            //   console.log("mark is clickable 222", config.w.config.yaxis.categories[config.dataPointIndex]);
            console.log("Marker of value is cliked", event, chartContext);
          },
        },
        markers: {
          onClick: function () {
            console.log("Marker of value is cliked 111");
            // console.log("Marker of value is cliked", e)
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
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
          ],
        },
        yaxis: [
          {
            title: {
              text: "Number of publications",
              style: {
                color: "#008FFB",
              },
            },
          },
        ],
        tooltip: {
          y: {
            shared: false,
            intersect: true,
            formatter: function (Abdo) {
              console.log("markers are hovered over", Abdo);
              return Abdo + " publications mentioned this word";
            },
          },
        },
      },
    };
  }
  conferenceshandleChange = (e) => {
    console.log("here chooseeen 1");
    this.setState(
      {
        selectedConferences: e.value,
      },
      function () {
        this.selectConfEvent(this.state.selectedConferences);
      }
    );
    console.log("here chooseeen");

    console.log("choosen conf ", this.state.selectedConferences);
  };

  selectConfEvent = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confevents: json.events,
        });
      });
  };

  setSelectedEvent = (e) => {
    this.setState({
      selectedEvent: e.value,
      isLoading: true,
    });
  };
  conferenceshandleChangeTwo = (e) => {
    console.log("second seleeeeect on change");
    this.setState(
      {
        selectedConferencesTwo: e.value,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
    console.log("here chooseeen i");

    console.log("choosen conf i ", this.state.selectedConferencesTwo);
  };

  selectConfEventTwo = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confeventsTwo: json.events,
        });
      });
  };

  setSelectedEventTwo = (e) => {
    this.setState({
      selectedEventTwo: e.value,
      isLoading: true,
    });
  };

  compareKeywordsInPapers = () => {
    this.setState({
      loader: true,
    });
    fetch(
      BASE_URL_CONFERENCE +
        "compareWordsInPapers/" +
        this.state.selectedEvent +
        "/" +
        this.state.selectedEventTwo +
        "/" +
        "keyword"
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        var series = [];
        series = series.concat([
          { name: this.state.selectedEvent, data: json.FirstEventValues },
          { name: this.state.selectedEventTwo, data: json.SecondEventValues },
        ]);
        this.setState({
          active1: false,
          active2: true,
          series: series,
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.sharedWords,
            },
          },
          loader: false,
        });
      });
  };

  compareTopicsInPapers = () => {
    this.setState({
      loader: true,
    });
    fetch(
      BASE_URL_CONFERENCE +
        "compareWordsInPapers/" +
        this.state.selectedEvent +
        "/" +
        this.state.selectedEventTwo +
        "/" +
        "topic"
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        var series = [];
        series = series.concat([
          { name: this.state.selectedEvent, data: json.FirstEventValues },
          { name: this.state.selectedEventTwo, data: json.SecondEventValues },
        ]);
        this.setState({
          active1: true,
          active2: false,
          series: series,
          options: {
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.sharedWords,
            },
          },
          loader: false,
        });
      });
  };

  render() {
    return (
      <Box id="chart" className="box">
        <br></br>
        <h2>Popularity of topics and keywords in conferences publications</h2>
        <p>
          Number of publications mentioning shared topics and keywords between
          conference events
        </p>
        <InputLabel style={{ color: "black" }}>
          Select two conference events to compare
        </InputLabel>
        <Grid container xs={12} md={12} spacing={3}>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="First conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConference
              )}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="First conference event "
              options={this.state.confevents}
              value={this.state.confevents.find(
                (obj) => obj.value === this.state.selectedEvent
              )}
              onChange={this.setSelectedEvent}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container xs={12} md={12} spacing={3}>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="Second conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="Second conference event"
              options={this.state.confeventsTwo}
              value={this.state.confeventsTwo.find(
                (obj) => obj.value === this.state.selectedEventTwo
              )}
              onChange={this.setSelectedEventTwo}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={3}>
          <Grid item>
            <RIMAButton
              active={this.state.active1}
              onClick={this.compareTopicsInPapers}
              name={"Topics"}
            />
          </Grid>
          <Grid item>
            <RIMAButton
              active={this.state.active2}
              onClick={this.compareKeywordsInPapers}
              name={"Keywords"}
            />
          </Grid>
        </Grid>
        <ActiveLoader
          marginLeft={"40%"}
          height={90}
          width={90}
          visible={this.state.loader}
        />
        <Box style={{ opacity: this.state.opacity }}>
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="bar"
            height={600}
          />
        </Box>
      </Box>
    );
  }
}

export default NewCompareTopicsInPapers;
