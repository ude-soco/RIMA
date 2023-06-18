// Implemented By Abdallah
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import { Grid, Box, InputLabel } from "@material-ui/core";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

class NewNumberOfSharedWords extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();
    this.state = {
      loader: false,
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "edm", label: "edm" },
        { value: "aied", label: "aied" },
      ],
      selectedConferences: ["lak", "aied", "edm"],
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
      series: [
        {
          name: "lak, edm, aied",
          data: [23, 34, 56, 43, 33],
        },
        {
          name: "lak, edm",
          data: [44, 56, 32, 52, 36],
        },
        {
          name: "lak, aied",
          data: [32, 46, 34, 52, 45],
        },
        {
          name: "edm, aied",
          data: [35, 40, 34, 38, 32],
        },
      ],
      options: {
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ],
        },
        yaxis: [
          {
            title: {
              text: "No. of shared topics",
              style: {
                color: "#008FFB",
              },
            },
          },
        ],
      },
    };
  }
  wordhandleChange = (e) => {
    this.setState({
      selectValue: e,
    });
  };

  conferenceshandleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState(
      {
        loader: true,
        selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
        selectedConferences: value,
      },
      function () {
        this.CompareSharedWordNumber();
      }
    );
  };

  selectSharedTopics = (e) => {
    this.setState({
      active1: true,
      active2: false,
      key: "topic",
    });
  };

  selectSharedKeywords = (e) => {
    this.setState({
      active1: false,
      active2: true,
      key: "keyowrd",
    });
  };

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
  };

  onClear = () => {
    this.setState({
      active1: false,
      active2: false,
      active3: false,
      active4: true,
      selectedConferences: [],
      years: [],
      selectValue: "",
      opacity: "0",
    });

    this.selectInputRef.current.select.clearValue();
  };

  CompareSharedWordNumber = () => {
    var { series } = this.state;
    var { weights } = this.state;
    fetch(
      BASE_URL_CONFERENCE +
        "getSharedWordsNumber/" +
        "?" +
        this.state.selectedConferences.join("&")
    )
      .then((response) => response.json())
      .then((json) => {
        series = [];
        weights = [];
        // for (let index = 0; index < 2; index++) {
        //   for (let i = 0; i < json.weights.length; i++) {
        //     weights[i] = json.weights[i][index];
        //   }
        //   if (index == 0) {
        //     // series = series.concat([
        //     //   { name: "No. of shared Topics", data: weights },
        //     // ]);
        //   } else {
        //     series = series.concat([
        //       { name: "No. of shared Topics", data: weights },
        //     ]);
        //   }
        //   weights = [];
        // }
        json.data.forEach((tuple) => {
          series = series.concat([
            { name: tuple[0]["name"], data: tuple[0]["data"] },
          ]);
        });
        console.log("json.sharedYears: ", json.sharedYears);
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
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.sharedYears,
            },
          },

          loader: false,
          opacity: "0.9",
        });
      });
  };

  render() {
    return (
      <Box component="form" role="form" method="POST" style={{ width: "100%" }}>
        <br></br>
        <h2>Shared topics and keywords evolution</h2>
        <p>
          The evolution of the number of shared topics and keywords between
          conferences.
        </p>
        <Box style={{ width: "100%" }}>
          <InputLabel>Select conferences</InputLabel>
          <Select
            ref={this.selectInputRef}
            name="selectOptions"
            isClearable
            isMulti
            placeholder="Select conferences to compare *"
            options={this.props.conferencesNames}
            value={this.props.conferencesNames.find(
              (obj) => obj.value === this.state.selectConference
            )}
            onChange={this.conferenceshandleChange}
            defaultValue={this.state.mulitSelectDefaultValues}
          />
        </Box>
        <br />
        {this.state.words.length == 0 && !this.state.active4 ? (
          <Box style={{ color: "red" }}>No common words found</Box>
        ) : (
          <Box />
        )}
        <Grid style={{ opacity: this.state.opacity }}>
          <Box
            style={{
              marginLeft: "50%",
              marginTop: "2%",
              position: "absolute",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                position: "absolute",
                marginLeft: "40%",
              }}
            >
              <Loader
                type="Bars"
                visible={this.state.loader}
                color="#00BFFF"
                height={50}
                width={50}
              />
            </Box>
          </Box>
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type={this.props.chartType}
            height={400}
          />
        </Grid>
      </Box>
    );
  }
}

export default NewNumberOfSharedWords;
