// updated By Islam Abdelghaffar
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import "d3-transition";
import ReactApexChart from "react-apexcharts";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Box, Grid, InputLabel } from "@mui/material";
import RIMAButton from "../../Application/ReuseableComponents/RIMAButton";

class NewCompareAuthorsPapersCol extends Component {
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
      space: " ",
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
          name: "aied",
          data: [120, 339, 100, 291, 110, 203, 325, 282, 298, 80],
        },
        {
          name: "edm",
          data: [91, 159, 181, 252, 305, 212, 130, 168, 268, 100],
        },
        {
          name: "lak",
          data: [226, 180, 165, 236, 377, 418, 221, 218, 287, 250],
        },
      ],
      options: {
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "1993",
            "2005",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
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
      },
      barChartOptions: {
        chart: {
          id: "bar",
          events: {
            dataPointMouseEnter: function (event, chartContext, config) {
              const xAxisLabel = config.w.globals.labels[config.dataPointIndex];
              this.updateBarChartTooltip(xAxisLabel);
            }.bind(this),
          },
        },
        stacked: false,
        xaxis: {
          categories: ["lak", "edm", "aied"],
        },
        yaxis: {
          show: false,
          labels: {
            show: false,
          },
        },
      },
      BarChartSeries: [
        {
          name: `The total no. of ${this.authorsOrPubs}
          in ${this.hoveredConf} conference ${this.firstYear}-${this.lastYear}`,
          data: [120, 339, 100],
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
          in ${hoveredConf} conference ${firstYear}-${lastYear}`,
        },
      ],
    }));
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

    console.log("Abdo");
    console.log(value);
    console.log("Abdo");

    this.setState({
      selectConference: Array.isArray(e) ? e.map((s) => s.value) : [],
      selectedConferences: value,
    });

    console.log("BAB");
    console.log(this.state.selectedConferences);
    console.log("BAB");
  };

  selectSharedTopics = (e) => {
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

  selectSharedKeywords = (e) => {
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
    if (this.state.key == "Authors") {
      var { series } = this.state;
      var { weights } = this.state;
      fetch(
        BASE_URL_CONFERENCE +
          "AuthorsPapersEvolutio/Authors/" +
          "?" +
          this.state.selectedConferences.join("&")
      )
        .then((response) => response.json())
        .then((json) => {
          series = [];
          weights = [];
          for (
            let index = 0;
            index < this.state.selectedConferences.length;
            index++
          ) {
            for (let i = 0; i < json.weights.length; i++) {
              weights[i] = json.weights[i][index];
            }
            series = series.concat([
              { name: this.state.selectedConferences[index], data: weights },
            ]);
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
              ...this.state.options,
              xaxis: {
                ...this.state.options.xaxis,
                categories: json.years,
              },
            },

            loader: false,
            opacity: "0.9",
          });
          this.years = json.years;
        });
      this.get_Authors_Publications_Data(this.state.key);
    } else {
      var { series } = this.state;
      var { weights } = this.state;
      fetch(
        BASE_URL_CONFERENCE +
          "AuthorsPapersEvolutio/Publications/" +
          "?" +
          this.state.selectedConferences.join("&")
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          console.log("TEST 1]k");
          series = [];
          weights = [];
          console.log("TEST 1]kkk");
          for (
            let index = 0;
            index < this.state.selectedConferences.length;
            index++
          ) {
            for (let i = 0; i < json.weights.length; i++) {
              weights[i] = json.weights[i][index];
            }
            series = series.concat([
              { name: this.state.selectedConferences[index], data: weights },
            ]);

            console.log("weights", weights);
            weights = [];
          }
          this.setState({
            selectConference: this.state.selectedConferences,
            active1: false,
            active2: true,
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
                categories: json.years,
              },
            },
            loader: false,
            opacity: "0.9",
          });
          this.years = json.years;
        });
      this.get_Authors_Publications_Data(this.state.key);
    }
  };

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log("imageTooltipOpen: ", this.state.imageTooltipOpen);
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

  get_Authors_Publications_Data(authors_publications) {
    fetch(
      BASE_URL_CONFERENCE +
        "TotalAuthorsPublicationsEvolution/" +
        authors_publications +
        "/" +
        "?" +
        this.state.selectedConferences.join("&")
    )
      .then((response) => response.json())
      .then((json) => {
        if (json && json[0].conferences && json[0][authors_publications]) {
          this.setState({
            barChartOptions: {
              ...this.state.barChartOptions,
              xaxis: {
                ...this.state.barChartOptions.xaxis,
                categories: json[0].conferences,
              },
            },
            BarChartSeries: [
              {
                ...this.state.BarChartSeries[0],
                data: json[0][authors_publications],
              },
            ],
          });
        }
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
          <h2>Number of authors and publications evolution</h2>
          <p>
            The total number and evolution of authors and publications between
            conferences
          </p>
          <InputLabel>Select conferences</InputLabel>
          <Grid container spacing={3}>
            <Grid item style={{ width: "60%" }}>
              <Select
                ref={this.selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select Option"
                options={this.props.conferencesNames}
                value={this.props.conferencesNames.find(
                  (obj) => obj.value === this.state.selectConference
                )}
                onChange={this.conferenceshandleChange}
                defaultValue={this.state.mulitSelectDefaultValues}
              />
            </Grid>
            <Grid item>
              <RIMAButton
                name={"Authors"}
                onClick={this.selectSharedTopics}
                activeButton={this.state.active1}
              />
            </Grid>
            <Grid item>
              <RIMAButton
                name={"Publications"}
                onClick={this.selectSharedKeywords}
                activeButton={this.state.active2}
              />
            </Grid>
          </Grid>
        </Box>
        <br />

        <Grid
          container
          xs={12}
          style={{ opacity: this.state.opacity, marginTop: "5%" }}
        >
          <Grid item xs={12} sm={8}>
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
                height={90}
                width={90}
              />
            </Box>
            <ReactApexChart
              options={this.state.options}
              series={this.state.series}
              type="area"
              height={350}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <ReactApexChart
              options={this.state.barChartOptions}
              series={this.state.BarChartSeries}
              type="bar"
              height={350}
            />
            <p
              style={{
                marginLeft: "25%",
              }}
            >
              The total number of {this.state.space} {this.state.key}
            </p>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default NewCompareAuthorsPapersCol;
