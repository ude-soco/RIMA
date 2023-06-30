//Done by Swarna
import React, { Component } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import Select from "react-select";
import "./styles.css";
import ReactApexChart from "react-apexcharts";
import { Button, Label } from "reactstrap";
import { Grid, InputLabel, Paper } from "@material-ui/core";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import InfoBox from "Views/Application/ReuseableComponents/InfoBox";
import GroupBarChart from "../../Application/ReuseableComponents/GroupBarChart.jsx";

class LAKStackedBarChart extends Component {
  constructor(props) {
    super(props);

    this.selectInputRef = React.createRef();
    this.selectyearValue = this.selectyearValue.bind(this);
    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.compareTopic = this.compareTopic.bind(this);
    this.clearValues = this.clearValues.bind(this);

    this.state = {
      weights: [],
      years: [],
      topics: [],
      series: [],
      selectedValue: "",
      selectYear: "",
      key: "",
      url: "",
      active1: true,
      active2: false,
      active3: false,
      active4: false,
      isLoaded: false,
      graphData: [],
      isModalLoader: false,
      opacity: "0",
    };
  }

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
  };

  componentDidMount() {
    var text = ["2011", "2012"];
    fetch(
      `${BASE_URL_CONFERENCE}` +
        "getalltopiclist/topic/?lak2011&lak2012&lak2013&lak2014"
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        console.log(json.Topiclist[0]);
        for (let i = 0; i < json.Topiclist[0].length; i++) {
          series = series.concat([
            {
              name: json.Topiclist[0][i].word,
              data: json.Topiclist[0][i].weight,
            },
          ]);
          //console.log("BAB"+ json.Topiclist[1][i] + json.Topiclist[0][i])
          //selectInputRef1.current.chart.publicMethods.updateOptions({})
        }
        this.setState({
          selectYear: Array(["2011", "2012"]),
          active3: true,
          active4: false,
          series: series,
          opacity: 1,

          options: {
            chart: {
              type: "bar",
              height: 350,
              stackType: "100%",
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: true,
              },
            },

            stroke: {
              curve: "smooth",
            },

            xaxis: {
              categories: [
                "lak2011",
                "lak2012",
                "lak2013",
                "lak2014",
                "lak2018",
                "lak2019",
                "lak2020",
                "lak2021",
                "lak2022",
                "lak2023",
              ],
            },
            xaxis: {
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
          series: [
            {
              name: "data",
              data: [7, 8, 5, 5, 7, 8, 8, 7, 3, 1],
            },
            {
              name: "learning",
              data: [9, 7, 8, 7, 5, 12, 17, 7, 4, 0],
            },
          ],
          years: [
            "lak2011",
            "lak2012",
            "lak2013",
            "lak2014",
            "lak2018",
            "lak2019",
            "lak2020",
            "lak2021",
            "lak2022",
            "lak2023",
          ],
          isLoaded: true,
        });
      });
  }

  selectKey(e) {
    this.setState({
      active1: false,
      active2: true,
      active3: false,
      active4: false,
      key: e.target.value,
    });
  }

  compareTopic() {
    //var key = this.state.key;
    // if (key == "key") {
    //   var text = this.state.selectedValue;
    //   fetch(
    //     `${BASE_URL_CONFERENCE}` + "getallkeylist/topic/" + "?" + text.join("&")
    //   )
    //     .then((response) => response.json())
    //     .then((json) => {
    //       var series = [];
    //       console.log(json.Topiclist[0]);
    //       for (let i = 0; i < json.Topiclist[0].length; i++) {
    //         series = series.concat([
    //           {
    //             name: json.Topiclist[0][i].word,
    //             data: json.Topiclist[0][i].weight,
    //           },
    //         ]);
    //         //selectInputRef1.current.chart.publicMethods.updateOptions({})
    //       }
    //       this.setState({
    //         active1: false,
    //         active2: true,
    //         active3: true,
    //         active4: false,
    //         opacity: 1,
    //         series: series,

    //         options: {
    //           chart: {
    //             type: "bar",
    //             height: 350,
    //             stacked: true,
    //             stackType: "100%",
    //             toolbar: {
    //               show: true,
    //             },
    //             zoom: {
    //               enabled: true,
    //             },
    //           },

    //           plotOptions: {
    //             bar: {
    //               horizontal: true,
    //             },
    //           },
    //           stroke: {
    //             width: 1,
    //             colors: ["#fff"],
    //           },

    //           xaxis: {
    //             categories: json.Topiclist[1],
    //           },
    //           yaxis: {
    //             title: {
    //               text: undefined,
    //             },
    //             labels: {
    //               style: {
    //                 fontWeight: 700,
    //               },
    //             },
    //           },
    //           fill: {
    //             opacity: 1,
    //           },
    //           legend: {
    //             position: "bottom",
    //             horizontalAlign: "left",
    //             offsetX: 40,
    //           },
    //         },
    //         years: json.Topiclist[1],
    //         isLoaded: true,
    //       });
    //     });
    // } else {
    var text = this.state.selectedValue;

    fetch(
      `${BASE_URL_CONFERENCE}` + "getPublicationsMultiEvents/" + text.join("&")
    )
      .then((response) => response.json())
      .then((json) => {
        // var series = [];

        // for (let i = 0; i < json.Topiclist[0].length; i++) {
        //   var weight = json.Topiclist[0][i].weight[0];
        //   var num = Math.floor(weight * 100);
        //   series = series.concat([
        //     {
        //       name: json.Topiclist[0][i].word,
        //       data: json.Topiclist[0][i].weight,
        //     },
        //   ]);
        //   //selectInputRef1.current.chart.publicMethods.updateOptions({})
        // }
        console.log("json.years", json.years);
        this.setState({
          active1: true,
          active2: false,
          active3: true,
          active4: false,
          opacity: 1,

          options: {
            chart: {
              type: "line",
              height: 350,
              stacked: false,
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: true,
              },
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                horizontal: false,
              },
            },
            stroke: {
              width: 1,
              colors: ["#fff"],
            },
            colors: [
              "#1f77b4",
              "#ff7f0e",
              "#2ca02c",
              "#d62728",
              "#9467bd",
              "#8c564b",
              "#e377c2",
              "#7f7f7f",
              "#bcbd22",
              "#17becf",
              "#aec7e8",
              "#ffbb78",
              "#98df8a",
              "#ff9896",
              "#c5b0d5",
              "#c49c94",
            ],
            xaxis: {
              categories: json.years,
            },
            yaxis: {
              forceNiceScale: true,
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
            dataLabels: {
              enabled: true,
            },
            tooltip: {
              enabled: true,
            },
          },
          series: json.data,
          isLoaded: true,
        });
      });
  }

  selectTopic(e) {
    this.setState({
      active1: true,
      active2: false,
      active3: false,
      active4: false,
      key: e.target.value,
    });
  }

  clearValues() {
    this.selectInputRef.current.select.clearValue();
    this.setState({
      opacity: "0",
      active4: true,
      active3: false,
    });
  }

  selectyearValue(e) {
    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
    this.setState({
      selectYear: value,
      selectedValue: value,
    });
    console.log("value is", this.state.selectedValue);
  }

  render() {
    var {
      keywords,
      isLoaded,
      selectYear,
      options,
      series,
      active1,
      active2,
      key,
      opacity,
      active3,
      active4,
    } = this.state;

    const yeardata = this.props.confEvents; // BAB 09.06.2021  years/data can be passed in props with the conference name.

    if (isLoaded) {
      return (
        <Grid container xs={12}>
          <Grid item xs={12}>
            <h3>Topic distribution across years</h3>
          </Grid>
          <Grid item xs={12}>
            <p>
              This visualization displays the comparison of topics over multiple
              years
            </p>
          </Grid>
          <Grid container xs={12}>
            <Grid item xs={12}>
              <InputLabel>Select a year *</InputLabel>
            </Grid>
            <Grid item md={5} xs={12}>
              <Select
                ref={this.selectInputRef}
                isMulti
                isClearable
                placeholder="Select Option"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
            </Grid>
          </Grid>
          <Grid
            container
            xs={12}
            md={8}
            spacing={2}
            style={{ marginTop: "1%" }}
          >
            <Grid item lg={1} md={2} xs={3}>
              <RIMAButton
                name={"Compare"}
                activeButton={active3}
                onClick={this.compareTopic}
              />
            </Grid>
            <Grid item lg={1} md={2} xs={3}>
              <RIMAButton
                name={"Reset"}
                activeButton={active4}
                onClick={this.clearValues}
              />
            </Grid>
            <Grid item lg={1} md={2} xs={3}>
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
                style={{
                  marginLeft: "2%",
                }}
              />
              {this.state.imageTooltipOpen && (
                <InfoBox
                  Info={"Each part in a bar represent a specific topic"}
                ></InfoBox>
              )}
            </Grid>
          </Grid>
          <br />
          {/* <Button
            outline
            value="topic"
            color="primary"
            active={active1}
            onClick={this.selectTopic}
          >
            Topic
          </Button> */}
          <GroupBarChart
            options={this.state.options}
            series={this.state.series}
          />
        </Grid>
      );
    } else {
      return (
        <>
          <h3>Topic distribution across years</h3>
          <br />
          <p>
            This visualization displays the comparison of topics/keywords over
            multiple years
          </p>
          <br />
          <Button
            outline
            value="topic"
            color="primary"
            active={active1}
            onClick={this.selectTopic}
          >
            Topic
          </Button>
          <Button
            outline
            value="key"
            color="primary"
            active={active2}
            onClick={this.selectKey}
          >
            Keyword
          </Button>
          <i
            className="fas fa-question-circle text-blue"
            onMouseOver={() => this.handleToogle(true)}
            onMouseOut={() => this.handleToogle(false)}
          />
          {this.state.imageTooltipOpen && (
            <div
              className="imgTooltip"
              style={{
                marginTop: "0px",
                position: "relative",
                left: "205px",
                width: "500px",
                height: "40px",
                color: "#8E8E8E",
                border: "1px solid #BDBDBD",
              }}
            >
              <p>Each part in a bar represent a specific topic/keyword</p>
            </div>
          )}
          <br />
          <br />
          <Label>Select years</Label>
          <br />
          <div style={{ width: "600px" }}>
            <Select
              ref={this.selectInputRef}
              isMulti
              isClearable
              placeholder="Select Option"
              options={yeardata}
              value={yeardata.find((obj) => obj.value === selectYear)}
              onChange={this.selectyearValue}
            />
          </div>
          <br />
          <Button
            outline
            active={active3}
            value="topic"
            color="primary"
            onClick={this.compareTopic}
          >
            Compare
          </Button>
          <Button
            outline
            active={active4}
            value="key"
            color="primary"
            onClick={this.clearValues}
          >
            Reset
          </Button>
          <br />
          <br />
        </>
      );
    }
  }
}

export default LAKStackedBarChart;
