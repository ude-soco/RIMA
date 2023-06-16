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
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";

class NewSharedAuthorEvolution extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      loader: false,
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "edm", label: "edm" },
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
          name: "No. of shared authors",
          data: [2, 3, 16, 11, 41, 61, 43, 15, 36, 16],
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
              text: "No. of shared authors",
              style: {
                color: "#008FFB",
              },
            },
          },
        ],
      },

      loader: false,
      display: "none",
      opacity: "0.9",
      selectValue: { value: "learning", label: "learning" },
      selectConference: "",
      key: "",
      active1: false,
      active2: true,
      active3: true,
      active4: false,
      imageTooltipOpen: false,
    };
  }

  wordhandleChange = (e) => {
    console.log(e.value);
    this.setState({
      selectValue: e,
    });
    console.log(this.state.selectValue);
  };

  conferenceshandleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];

    console.log(value);

    this.setState(
      {
        loader: true,
        selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
        selectedConferences: value,
      },
      function () {
        this.compareSharedTotalAuthors();
      }
    );

    console.log(this.state.selectedConferences);
  };

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
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

  compareSharedTotalAuthors = () => {
    var { series, yaxis } = this.state;
    var selectedConfsCount = this.state.selectedConferences.length;
    if (selectedConfsCount == 0) {
      this.setState({
        loader: false,
        series: [],
      });
      return;
    }
    if (selectedConfsCount <= 1) {
      yaxis = [
        {
          title: {
            text: "No. of total authors",
            style: {
              color: "#008FFB",
            },
          },
        },
      ];
      this.setState({
        yaxis: yaxis,
      });
    }
    if (selectedConfsCount > 1) {
      yaxis = [
        {
          title: {
            text: "No. of shared authors",
            style: {
              color: "#008FFB",
            },
          },
        },
      ];
      this.setState({
        yaxis: yaxis,
      });
    }
    fetch(
      BASE_URL_CONFERENCE +
        "getTotalSharedAuthorsEvolution/" +
        "?" +
        this.state.selectedConferences.join("&")
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        series = [];
        json.data.forEach((tuple) => {
          console.log("tuple", tuple[0]["name"], ",", tuple[0]["data"]);
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
            yaxis: yaxis,
          },
          loader: false,
          opacity: "0.9",
        });
      });
  };

  render() {
    return (
      <Box component="form" role="form" method="POST" style={{ width: "100%" }}>
        <br />
        <h2>Total and shared authors evolution</h2>
        <p>
          The evolution of the number of total/shared authors between
          conferences.{" "}
        </p>
        <Box style={{ width: "100%" }}>
          <InputLabel>Select conferences</InputLabel>
          <Select
            ref={this.selectInputRef}
            name="selectOptions"
            isClearable
            isMulti
            placeholder="Select conferences to compare"
            options={this.props.conferencesNames}
            value={this.props.conferencesNames.find(
              (obj) => obj.value === this.state.selectConference
            )}
            onChange={this.conferenceshandleChange}
            defaultValue={this.state.mulitSelectDefaultValues}
          />
        </Box>
        {this.state.words.length == 0 && !this.state.active4 ? (
          <Box style={{ color: "red" }}>No common authors found</Box>
        ) : (
          <Box />
        )}
        <br />
        <Grid item style={{ opacity: this.state.opacity }}>
          <ActiveLoader height={50} width={50} visible={this.state.loader} />
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="area"
            height={350}
          />
        </Grid>
      </Box>
    );
  }
}

export default NewSharedAuthorEvolution;
