// Updated By Islam Abdelghaffar not used anymore need to be reviewed
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  Grid,
  Box,
  InputLabel,
  Fade,
  Card,
  Typography,
} from "@material-ui/core";
import InfoBox from "Views/Application/ReuseableComponents/InfoBox";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton.jsx";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";
class NewCompareStackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.selectInputRef = React.createRef(); //question
    this.selectInputRef1 = React.createRef();

    this.state = {
      loader: false,
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "edm", label: "edm" },
      ],
      selectConference: "",
      selectedEventThree: "",
      selectedConferences: [],
      checkThird: false,
      checkThird2: true,
      confevents: [],
      confeventsTwo: [],
      confeventsThree: [],
      years: [
        {
          value: "2020",
          label: "2020",
        },
        {
          value: "2013",
          label: "2013",
        },
        {
          value: "2017",
          label: "2017",
        },
        {
          value: "2015",
          label: "2015",
        },
        {
          value: "2018",
          label: "2018",
        },
        {
          value: "2011",
          label: "2011",
        },
        {
          value: "2019",
          label: "2019",
        },
      ],
      weights: [],
      key: "",

      series: [
        {
          name: "student",
          data: [217, 172],
        },
        {
          name: "students",
          data: [162, 114],
        },
        {
          name: "learning",
          data: [287, 143],
        },
        {
          name: "model",
          data: [100, 81],
        },
        {
          name: "data",
          data: [107, 69],
        },
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
          categories: ["lak2020", "edm2020"],
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

      display: "none",
      opacity: "0.9",
      selectValue: { value: "2020", label: "2020" },
      selectTopic: "",

      active1: false,
      active2: false,
      active3: false,
      active4: false,
      imageTooltipOpen: false,
    };
  }

  conferenceshandleChange = (e) => {
    this.setState(
      {
        selectedConferences: e.value,
        selectedConferences2: e,
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
      selectedEvent2: e,

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

  conferenceshandleChangeThree = (e) => {
    this.setState(
      {
        selectedConferencesThree: e.value,
      },
      function () {
        this.selectConfEventThree(this.state.selectedConferencesThree);
      }
    );
  };

  selectConfEventThree = (val) => {
    fetch(BASE_URL_CONFERENCE + "confEvents/" + val)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          confeventsThree: json.events,
        });
      });
  };

  setSelectedEventThree = (e) => {
    this.setState({
      selectedEventThree: e.value,
      isLoading: true,
    });
  };

  selectSharedWords = (val) => {
    if (!this.state.selectedEvent || !this.state.selectedEventTwo) {
      return;
    }
    this.setState({
      loader: true,
    });
    if (
      this.state.selectedEventThree == "" ||
      this.state.checkThird === false
    ) {
      fetch(
        BASE_URL_CONFERENCE +
          "getSharedWordsBar/" +
          val +
          "/" +
          this.state.selectedEvent +
          "/" +
          this.state.selectedEventTwo
      )
        .then((response) => response.json())
        .then((json) => {
          var series = [];
          for (let i = 0; i < json.Topiclist[0].length; i++) {
            series = series.concat([
              {
                name: json.Topiclist[0][i].word,
                data: json.Topiclist[0][i].weight,
              },
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
                ...this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.Topiclist[1],
                },
              },
              loader: false,
            });
          } else {
            this.setState({
              active1: false,
              active2: true,
              active3: false,
              active4: false,
              opacity: 1,
              series: series,
              options: {
                ...this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.Topiclist[1],
                },
              },
              loader: false,
            });
          }
        });
    } else {
      fetch(
        BASE_URL_CONFERENCE +
          "getSharedWordsBar/" +
          val +
          "/" +
          this.state.selectedEvent +
          "/" +
          this.state.selectedEventTwo +
          "/" +
          this.state.selectedEventThree
      )
        .then((response) => response.json())
        .then((json) => {
          var series = [];
          for (let i = 0; i < json.Topiclist[0].length; i++) {
            series = series.concat([
              {
                name: json.Topiclist[0][i].word,
                data: json.Topiclist[0][i].weight,
              },
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
                ...this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.Topiclist[1],
                },
              },
              loader: false,
            });
          } else {
            this.setState({
              active1: false,
              active2: true,
              active3: false,
              active4: false,
              opacity: 1,
              series: series,
              options: {
                ...this.state.options,
                xaxis: {
                  ...this.state.options.xaxis,
                  categories: json.Topiclist[1],
                },
              },
              loader: false,
            });
          }
        });
    }
  };

  selectSharedKeywords = (e) => {
    fetch(
      BASE_URL_CONFERENCE +
        "getSharedWordsBar/keyword/" +
        this.state.selectedEvent +
        this.state.selectedEventTwo +
        this.state.selectedEventThree
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        for (let i = 0; i < json.Topiclist[0].length; i++) {
          series = series.concat([
            {
              name: json.Topiclist[0][i].word,
              data: json.Topiclist[0][i].weight,
            },
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
            ...this.state.options,
            xaxis: {
              ...this.state.options.xaxis,
              categories: json.Topiclist[1],
            },
          },
        });
      });
  };
  changeBackgroundh = (e) => {
    e.target.style.background = "#B0D4FF";
  };
  changeBackgroundh2 = (e) => {
    e.target.style.background = "#F5F5F2";
    if (this.state.checkThird === true) {
      e.target.style.background = "#B0D4FF";
    } else {
      e.target.style.background = "#F5F5F2";
    }
  };
  changeBackgroundhh2 = (e) => {
    e.target.style.background = "#F5F5F2";
    if (this.state.checkThird2 === true) {
      e.target.style.background = "#B0D4FF";
    } else {
      e.target.style.background = "#F5F5F2";
    }
  };
  handleClickh = (e) => {
    console.log("h4 clicked: ", this.state.checkThird);
    this.setState(
      {
        checkThird: !this.state.checkThird,
        checkThird2: !this.state.checkThird2,
      },
      () => {
        console.log("After update: ", this.state.checkThird);
      }
    );
  };
  handleClickh2 = (e) => {
    if (this.state.checkThird2 === true) {
      this.setState({
        checkThird2: false,
      });
    } else {
      this.setState({
        checkThird2: true,
      });
    }
  };
  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
  };
  handleToogle2 = (status) => {
    this.setState({ imageTooltipOpen2: status });
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

  render() {
    return (
      <Box component="form" role="form" method="form" style={{ width: "100%" }}>
        <br></br>
        <Typography
          style={{ fontWeight: "bold" }}
          variant="h6"
          component="h1"
          gutterBottom
        >
          Popularity of shared topics and keywords
        </Typography>
        <Typography>
          Popularity percentages of the shared topics and keywords between
          conference events.
        </Typography>
        <Grid container md={12} style={{ marginTop: "2%" }} spacing={0}>
          <Grid item md={3} xs={4} lg="auto">
            <InputLabel>Select conference events</InputLabel>
          </Grid>
          <Grid item md={1}>
            <i
              className="fas fa-question-circle text-blue"
              onMouseOver={() => this.handleToogle2(true)}
              onMouseOut={() => this.handleToogle2(false)}
            />
            {this.state.imageTooltipOpen2 && (
              <InfoBox
                Info={`
              This visualization is comparing shared topics/keywords between
              conference events, so you have to select at least 2 conferece
              events to compare.
              `}
              />
            )}
          </Grid>
        </Grid>
        <Grid container md={12} xs={12} spacing={3}>
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
          <Grid item xs={5} md={5}>
            <Select
              placeholder="Second conference"
              options={this.props.conferencesNames}
              value={this.props.conferencesNames.find(
                (obj) => obj.value === this.state.selectConferenceTwo
              )}
              onChange={this.conferenceshandleChangeTwo}
            />
          </Grid>

          <Grid item xs={5} md={5}>
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
        <Fade unmountOnExit in={this.state.checkThird2}>
          <Typography
            variant="h6"
            gutterBottom
            onMouseEnter={this.changeBackgroundh}
            onMouseLeave={this.changeBackgroundh2}
            onClick={this.handleClickh}
            style={{ width: "100%", borderRadius: "40px", fontSize: "1rem" }}
          >
            + Add third event
          </Typography>
        </Fade>
        <Fade unmountOnExit in={this.state.checkThird}>
          <Grid container xs={12} md={12} spacing={3}>
            <Grid item xs={5} md={5}>
              <Select
                placeholder="Third conference"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find(
                  (obj) => obj.value === this.state.selectConferenceThree
                )}
                onChange={this.conferenceshandleChangeThree}
              />
            </Grid>
            <Grid item xs={5} md={5}>
              <Select
                placeholder="Third conference event"
                options={this.state.confeventsThree}
                value={this.state.confeventsThree.find(
                  (obj) => obj.value === this.state.selectedEventThree
                )}
                onChange={this.setSelectedEventThree}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="h6"
                gutterBottom
                checked={this.state.checkThird}
                onMouseEnter={this.changeBackgroundh}
                onMouseLeave={this.changeBackgroundhh2}
                onClick={this.handleClickh}
                style={{
                  width: "100%",
                  borderRadius: "40px",
                  fontSize: "1rem",
                }}
              >
                {" "}
                - Shrink third event{" "}
              </Typography>
            </Grid>
          </Grid>
        </Fade>
        <br />
        <Grid container xs={12} spacing={3}>
          <Grid item>
            <RIMAButton
              active={this.state.active1}
              onClick={() => this.selectSharedWords("topic")}
              name={"Topics"}
            />
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <RIMAButton
                  active={this.state.active2}
                  onClick={() => this.selectSharedWords("keyword")}
                  name={"Keywords"}
                />
              </Grid>
              <Grid item>
                <i
                  className="fas fa-question-circle text-blue"
                  onMouseOver={() => this.handleToogle(true)}
                  onMouseOut={() => this.handleToogle(false)}
                />
                {this.state.imageTooltipOpen && (
                  <InfoBox
                    Info={` Hover over legend to highlight the evolution of a topic/keyword`}
                  />
                )}
              </Grid>
            </Grid>
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
            height={400}
          />
        </Box>
      </Box>
    );
  }
}

export default getalltopicsevolutionNewCompareStackedBarChart;
