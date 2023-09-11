// Updated By Islam Abdelghaffar
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  Grid,
  Box,
  InputLabel,
  Typography,
  Fade,
  Paper,
} from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";
import CustomizedDialog from "Views/Application/ReuseableComponents/CustomizedDialog.jsx";

class ComparativePopularitySharedTopics extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef();

    this.state = {
      openCustomizedDialog: false,
      items: [],
      loader: false,
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "aied", label: "aied" },
        { value: "edm", label: "edm" },
      ],
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
            dataPointSelection: function (event, chartContext, config) {
              const xAxisLabel = config.w.globals.labels[config.dataPointIndex];
              const seriesData = chartContext.w.config.series;
              const seriesIndex = config.seriesIndex; // Index of the series
              const seriesName = seriesData[seriesIndex].name;
              this.selectedKeywordTopic = xAxisLabel;
              this.eventName = seriesName;
              this.getPublicationList({
                keywordTopic_name: xAxisLabel,
                eventname: seriesName,
              });
            }.bind(this),
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
              return Abdo + " publications mentioned this word";
            },
          },
        },
      },
    };
  }
  conferenceshandleChange = (e) => {
    this.setState(
      {
        selectedConferences: e.value,
      },
      function () {
        this.selectConfEvent(this.state.selectedConferences);
      }
    );
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
    this.setState(
      {
        selectedConferencesTwo: e.value,
      },
      function () {
        this.selectConfEventTwo(this.state.selectedConferencesTwo);
      }
    );
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
    if (!this.state.selectedEvent || !this.selectConfEventTwo) {
      return;
    }
    this.setState({
      loader: true,
      keywordsOrTopic: "keyword",
      active1: false,
      active2: true,
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
        var series = [];
        series = series.concat([
          { name: this.state.selectedEvent, data: json.FirstEventValues },
          { name: this.state.selectedEventTwo, data: json.SecondEventValues },
        ]);
        this.setState({
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
    if (!this.state.selectedEvent || !this.selectConfEventTwo) {
      return;
    }
    this.setState({
      loader: true,
      keywordsOrTopic: "keyword",
      active1: true,
      active2: false,
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
        var series = [];
        series = series.concat([
          { name: this.state.selectedEvent, data: json.FirstEventValues },
          { name: this.state.selectedEventTwo, data: json.SecondEventValues },
        ]);
        this.setState({
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
  async getPublicationList(obj) {
    try {
      let keywordsTopics = [];
      this.state.options.xaxis.categories.forEach((keywordTopic) => {
        keywordsTopics.push({
          label: keywordTopic,
          value: keywordTopic,
        });
      });
      this.setState({
        words: keywordsTopics,
        selectedKeywordTopic: obj.keywordTopic_name,
      });
      const response = await fetch(
        BASE_URL_CONFERENCE +
          "conference/" +
          " " +
          "/event/" +
          obj.eventname +
          "/word/" +
          obj.keywordTopic_name +
          "/publications"
      );
      const result = await response.json();
      this.setState({
        items: result.publicationList,
        eventname: obj.eventname,
        openCustomizedDialog: true,
      });
    } catch (error) {}
  }
  render() {
    return (
      <Box id="chart" className="box">
        <br></br>
        <Typography
          style={{ fontWeight: "bold" }}
          variant="h5"
          component="h1"
          gutterBottom
        >
          Comparative Popularity of Shared Topics in Conference Events
        </Typography>
        <Typography>
          Number of publications mentioning shared topics and keywords between
          conference events
        </Typography>
        <br />
        <InputLabel>Select two conference events to compare</InputLabel>
        <Grid container xs={12} md={12} spacing={3}>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="First conference *"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConference
              )}
              onChange={this.conferenceshandleChange}
            />
          </Grid>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="First conference event *"
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
              placeholder="Second conference *"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>
          <Grid item md={5} xs={5}>
            <Select
              placeholder="Second conference event *"
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
              activeButton={this.state.active1}
              onClick={this.compareTopicsInPapers}
              name={"Topics"}
            />
          </Grid>
          {/* <Grid item>
            <RIMAButton
              activeButton={this.state.active2}
              onClick={this.compareKeywordsInPapers}
              name={"Keywords"}
            />
          </Grid> */}
          <Grid item>
            {this.state.openCustomizedDialog &&
              this.state.items &&
              this.state.eventname &&
              this.state.keywordsOrTopic &&
              this.state.selectedKeywordTopic && (
                <CustomizedDialog
                  publications={this.state.items}
                  keywordsOrTopicsProp={this.state.words}
                  selectedKeywordTopicProp={this.state.selectedKeywordTopic}
                  eventnameProp={this.state.eventname}
                  keywordsOrTopicProp={this.state.keywordsOrTopic}
                />
              )}
          </Grid>
        </Grid>
        <ActiveLoader
          marginLeft={"40%"}
          height={90}
          width={90}
          visible={this.state.loader}
        />
        <Grid style={{ opacity: this.state.opacity, marginTop: "1%" }}>
          <Paper style={{ borderRadius: "40px", padding: "1%" }} elevation={10}>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={600}
            />
          </Paper>
        </Grid>
      </Box>
    );
  }
}

export default ComparativePopularitySharedTopics;
