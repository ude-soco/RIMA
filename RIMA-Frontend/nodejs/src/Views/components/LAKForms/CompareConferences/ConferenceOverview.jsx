// updated By Islam Abdelghaffar
import React, { Component } from "react";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Box, Grid, InputLabel } from "@mui/material";
import { Paper, Typography } from "@material-ui/core";

class ConferenceOverview extends Component {
  constructor(props) {
    super(props);
    this.updateBarChartTooltip = this.updateBarChartTooltip.bind(this);
    this.selectInputRef = React.createRef();
    this.authorsOrPubs = "Authors";
    this.firstYear = "1993";
    this.lastYear = "2023";
    this.hoveredConf = "lak";
    this.years = [];

    this.state = {
      mulitSelectDefaultValues: [
        { value: "lak", label: "lak" },
        { value: "aied", label: "aied" },
        { value: "edm", label: "edm" },
      ],
      key: "Authors",
      selectedConferences: ["lak", "aied", "edm"],
      series: [],

      data: {
        authors: [],
        publications: [],
      },
      selectedOption: "",
      weights: [],
      options: {
        stroke: {
          curve: "smooth",
        },
        color: "#008FFB",
      },
      barChartOptions: {
        stacked: false,

        xaxis: {
          categories: ["lak", "edm", "aied"],
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
          },
        },
      },
      groupedChartOptions: {
        stacked: false,
        chart: {
          events: {
            dataPointMouseEnter: function (event, chartContext, config) {
              const xAxisLabel = config.w.globals.labels[config.dataPointIndex];
              this.updateBarChartTooltip(xAxisLabel);
            }.bind(this),
          },
        },
        xaxis: {
          categories: ["lak", "edm", "aied"],
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
          },
        },
      },
      BarChartSeries: [
        {
          name: `The total no. of Authors
          in ${this.hoveredConf} conference ${this.firstYear}-${this.lastYear}`,
          data: [120, 200, 150],
        },
        {
          name: `The total no. of Publications
          in ${this.hoveredConf} conference ${this.firstYear}-${this.lastYear}`,
          data: [130, 300, 400],
        },
      ],
      BarChartEventsSeries: [
        {
          name: `The total no. of events
          in ${this.hoveredConf} conference `,
          data: [13],
        },
        {
          name: `The total no. of events
          in ${this.hoveredConf} conference `,
          data: [15],
        },
        {
          name: `The total no. of events
          in ${this.hoveredConf} conference`,
          data: [16],
        },
      ],
      loader: false,
      hovered1: false,
      hovered2: false,
    };
  }

  updateBarChartTooltip(hoveredConf) {
    const firstYear = this.years[0] ? this.years[0] : "1993";
    const lastYear = this.years.slice(-1)[0] ? this.years.slice(-1)[0] : "2014";
    this.setState((pervState) => ({
      BarChartSeries: [
        {
          ...pervState.BarChartSeries[0],
          name: `The total no. of ${this.state.key}
          in ${hoveredConf} conference
           ${firstYear}-${lastYear}`,
        },
      ],
    }));
  }
  wordhandleChange = (e) => {
    this.setState({
      selectValue: e,
    });
  };

  conferenceshandleChange = (e) => {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];

    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    });


    this.selectSharedAuthors();
    this.selectSharedPublications();
  };

  selectSharedAuthors = (e) => {
    this.setState(
      {
        active1: true,
        active2: false,
        loader: true,
        key: "Authors",
      },
      function () {
        this.clickEvent();
      }
    );
  };

  selectSharedPublications = (e) => {
    this.setState(
      {
        active1: false,
        active2: true,
        loader: true,
        key: "Publications",
      },
      function () {
        this.clickEvent();
      }
    );
  };
  clickEvent = () => {
    this.get_Authors_Publications_Data();
    this.getEventNoForEachConf();
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

  get_Authors_Publications_Data() {
    fetch(
      BASE_URL_CONFERENCE +
        "conferences/confsName/" +
        this.state.selectedConferences.join("&") +
        "/authors/publications/evolution/"
    )
      .then((response) => response.json())
      .then((json) => {
        if (json[0].Publications && json[0].Authors) {
          let newSeries = [
            {
              name: `The total no. of Authors 
                in ${this.hoveredConf} conference ${this.firstYear}-${this.lastYear}`,
              data: json[0].Authors,
            },
            {
              name: `The total no. of Publications 
                in ${this.hoveredConf} conference ${this.firstYear}-${this.lastYear}`,
              data: json[0].Publications,
            },
          ];

          this.setState({
            barChartOptions: {
              ...this.state.barChartOptions,
              xaxis: {
                ...this.state.barChartOptions.xaxis,
                categories: this.state.selectedConferences,
              },
            },
            BarChartSeries: newSeries,
          });
        }
      });
  }

  getEventNoForEachConf() {
    fetch(
      BASE_URL_CONFERENCE +
        "conferences/confsName/" +
        this.state.selectedConferences.join("&") 
        +'/events/totalNumber/'
    )
      .then((response) => response.json())
      .then((json) => {
        let newSeries = json.map((item) => {
          return {
            name: `The total no. of events in ${item.name} conference`,
            data: item.data,
          };
        });

        this.setState({
          BarChartEventsSeries: newSeries,
        });
      });
  }

  handleMouseEnter = (e) => {
    if (e == "hovered1") {
      this.setState({
        hovered1: true,
      });
    } else if ("hovered2") {
      this.setState({
        hovered2: true,
      });
    }
  };
  handleMouseLeave = (e) => {
    if (e == "hovered1") {
      this.setState({
        hovered1: false,
      });
    } else if ("hovered2") {
      this.setState({
        hovered2: false,
      });
    }
  };
  render() {
    return (
      <Box component="form" role="form" method="POST">
        <Box>
          <br />
          <h2>Number of Events, Authors, and Publications for Conferences</h2>
          <p>
            Comparing Total Number of Events, Authors, and Publications for Each
            Conference{" "}
          </p>
          <InputLabel>Select conferences</InputLabel>
          <Grid container spacing={3}>
            <Grid item style={{ width: "60%" }}>
              <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select Option *"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find(
                  (obj) => obj.value === this.state.selectConference
                )}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}
              />
            </Grid>
          </Grid>
        </Box>
        <br />
        <Grid
          container
          style={{
            opacity: this.state.opacity,
            marginTop: "1%",
          }}
          spacing={3}
        >
          <Grid item xs={12} lg={6}>
            <Paper style={{ borderRadius: "40px" }} elevation={10}>
              <Typography
                variant="h5"
                style={{
                  textAlign: "center",
                }}
              >
                The total number of events in each conference
              </Typography>
              <ReactApexChart
                options={this.state.barChartOptions}
                series={this.state.BarChartEventsSeries}
                type="bar"
                height={350}
                width="100%"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper
              style={{ borderRadius: "40px", padding: "1%" }}
              elevation={10}
            >
              <Typography
                variant="h5"
                style={{
                  textAlign: "center",
                }}
              >
                The total number of Authors and Publications in each conference
              </Typography>
              <ReactApexChart
                options={this.state.barChartOptions}
                series={this.state.BarChartSeries}
                type="bar"
                height={350}
                width="100%"
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default ConferenceOverview;
