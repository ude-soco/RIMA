//Done by Swarna
import React, { Component } from "react";
import Select from "react-select";
import "d3-transition";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { Button, Label, FormGroup, Form, Row, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";

class TopicBar extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectYear = this.selectYear.bind(this);
    this.selectKeyword = this.selectKeyword.bind(this);
    this.displayDocChart = this.displayDocChart.bind(this);
    this.state = {
      selectValue: "",
      selectyear: "",
      selecttype: "",
      items: [],
      weights: [],
      series1: [],
      items1: [],
      secondchart: false,
      isLoaded: false,
      showViz: false,
      series: [],
      options: {},
      options1: {},
      active1: true,
      active2: false,
      imageTooltipOpen: false,
    };
  }

  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
  };

  changeColor(index) {
    this.setState({
      ...this.state.options,
      options: {},
    });
  }

  displayDocChart(type, topic, year) {
    var selectyear = "2011";
    console.log("faasdasd", type);
    fetch(
      `${BASE_URL_CONFERENCE}` +
        "topicdetails/" +
        type +
        "/" +
        topic +
        "/" +
        year
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          items1: json.docs[0],
          numdocs: json.docs[1],
          //bardata:json.docs[2],
          //doctitle:json.docs[3],
          series1: [{ name: "", data: json.docs[1] }],
          options1: {
            dataLabels: {
              enabled: true,
            },
            title: {
              text: "          Publications related to '" + topic + "'",
            },
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  var title =
                    config.w.config.xaxis.categories[config.dataPointIndex];
                  var url;
                  fetch(`${BASE_URL_CONFERENCE}` + "fetchpaper/" + title)
                    .then((response) => response.json())
                    .then((json) => {
                      url = json.url;
                      console.log(url);
                      window.open(url);
                    });
                },
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                colors: {
                  ranges: {
                    from: 50,
                    to: 10,
                    color: "black",
                  },
                },
              },
            },
            xaxis: {
              categories: json.docs[0],
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.globals.labels[dataPointIndex] +
                  "<br></br><b>" +
                  "click on the bar to view more..</b>" +
                  "</span>" +
                  "</div>"
                );
              },
            },

            fill: {
              colors: ["#eababa", "#006400", "#E91E63"],
              strokeColors: "#fff",
              hover: {
                size: 20,
              },
            },

            noData: {
              text: "No data Found",
              align: "center",
              verticalAlign: "middle",
              offsetX: 0,
              offsetY: 0,
              style: {
                color: undefined,
                fontSize: "25px",
                fontFamily: undefined,
              },
            },
          },
          secondchart: true,
        });
      });
  }
  /* new function */
  displaytopicDocChart(topic, year) {
    var selectyear = "2011";
    fetch(`${BASE_URL_CONFERENCE}` + "topicdetails/topic/" + topic + "/" + year)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          items1: json.docs[0],
          numdocs: json.docs[1],
          //bardata:json.docs[2],
          //doctitle:json.docs[3],
          series1: [{ name: "", data: json.docs[1] }],
          options1: {
            dataLabels: {
              enabled: true,
            },
            title: {
              text: "publications related to '" + topic + "'",
            },
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  var title =
                    config.w.config.xaxis.categories[config.dataPointIndex];
                  var url;
                  fetch(`${BASE_URL_CONFERENCE}` + "fetchpaper/" + title)
                    .then((response) => response.json())
                    .then((json) => {
                      url = json.url;
                      console.log(url);
                      window.open(url);
                    });
                },
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                colors: {
                  ranges: {
                    from: 50,
                    to: 10,
                    color: "black",
                  },
                },
              },
            },
            xaxis: {
              categories: json.docs[0],
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.globals.labels[dataPointIndex] +
                  "<br></br><b>" +
                  "click on the bar to view more..</b>" +
                  "</span>" +
                  "</div>"
                );
              },
            },

            fill: {
              colors: ["#eababa", "#006400", "#E91E63"],
              strokeColors: "#fff",
              hover: {
                size: 20,
              },
            },

            noData: {
              text: "No data Found",
              align: "center",
              verticalAlign: "middle",
              offsetX: 0,
              offsetY: 0,
              style: {
                color: undefined,
                fontSize: "25px",
                fontFamily: undefined,
              },
            },
          },
          secondchart: true,
        });
      });
  }
  componentDidUpdate(prevProps) {
    if (this.props.confEvent !== prevProps.confEvent) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const display = this.displayDocChart;
    fetch(`${BASE_URL_CONFERENCE}` + "toptopics/topic/" + this.props.confEvent)
      .then((response) => response.json())
      .then((json) => {
        this.setState(
          {
            selectyear: this.props.confEvent,
            series: [
              {
                name: "Topics",
                data: json.keywords[1],
              },
            ],
            options: {
              chart: {
                type: "bar",

                events: {
                  dataPointSelection: function (event, chartContext, config) {
                    var topic =
                      config.w.config.xaxis.categories[config.dataPointIndex];
                    console.log("chartContext " + chartContext);
                    console.log(
                      "config.w.globals.selectedDataPoints[0][0]" +
                        config.w.globals.selectedDataPoints[0][0]
                    );
                    display("topic", topic, this.props.confEvent);
                  },
                },
              },
              fill: {
                colors: ["#eababa", "#006400", "#E91E63"],
                Range: {
                  from: 50,
                  to: 0,
                },
                hover: {
                  size: 20,
                },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  colors: {
                    ranges: {
                      from: 50,
                      to: 10,
                      color: "#eababa",
                    },
                  },
                },
              },
              xaxis: {
                categories: json.keywords[0],
              },
              tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  return (
                    '<div class="arrow_box">' +
                    "<span>" +
                    "<b>click on the bar to view publications</b>" +
                    "</span>" +
                    "</div>"
                  );
                },
              },
              title: {
                text: "Top 10 topics",
              },
              noData: {
                text: "No data found",
                align: "center",
                verticalAlign: "middle",
                offsetX: 0,
                offsetY: 0,
                style: {
                  color: undefined,
                  fontSize: "14px",
                  fontFamily: undefined,
                },
              },
            },
            isLoaded: true,
          },
          display("topic", "Learning", this.props.confEvent)
        );
      });
  }

  selectYear(e) {
    this.setState({
      selectyear: e.value,
    });
  }

  selectKeyword(e) {
    const display = this.displayDocChart;
    var year = this.state.selectyear;
    fetch(
      `${BASE_URL_CONFERENCE}` + "topkeywords/keyword/" + this.state.selectyear
    )
      .then((response) => response.json())
      .then((json) => {
        var { items, weights } = this.state;
        console.log(items);
        console.log(weights);
        this.setState(
          {
            active1: false,
            active2: true,
            series: [
              {
                name: "Keywords",
                data: json.keywords[1],
              },
            ],
            options: {
              chart: {
                type: "bar",
                events: {
                  dataPointSelection: function (event, chartContext, config) {
                    var topic =
                      config.w.config.xaxis.categories[config.dataPointIndex];
                    console.log(topic);
                    display("keyword", topic, year);
                  },
                },
              },
              fill: {
                colors: ["#eababa", "#006400"],
                strokeColors: "#fff",
                hover: {
                  size: 20,
                },
              },

              plotOptions: {
                bar: {
                  horizontal: true,
                  colors: {
                    ranges: {
                      from: 50,
                      to: 0,
                      color: "black",
                    },
                  },
                },
              },
              xaxis: {
                categories: json.keywords[0],
              },
              tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  return (
                    '<div class="arrow_box">' +
                    "<span>" +
                    "<b>click on the bar to view publications</b>" +
                    "</span>" +
                    "</div>"
                  );
                },
              },
              title: {
                text: "Top 10 keywords",
              },
            },
            isLoaded: true,
          },
          display("keyword", json.keywords[0][0], year)
        );
      });
  }

  selectValue(e) {
    const display = this.displayDocChart;
    var year = this.state.selectyear;
    var type = "topic";
    fetch(`${BASE_URL_CONFERENCE}` + "toptopics/topic/" + this.state.selectyear)
      .then((response) => response.json())
      .then((json) => {
        this.setState(
          {
            active1: true,
            active2: false,
            series: [
              {
                name: "Topics",
                data: json.keywords[1],
              },
            ],
            options: {
              chart: {
                type: "bar",
                events: {
                  dataPointSelection: function (event, chartContext, config) {
                    var topic =
                      config.w.config.xaxis.categories[config.dataPointIndex];
                    console.log(topic);
                    display(type, topic, year);
                  },
                },
              },
              fill: {
                colors: ["#eababa", "#006400"],
                strokeColors: "#fff",
                hover: {
                  size: 20,
                },
              },

              plotOptions: {
                bar: {
                  horizontal: true,
                  colors: {
                    ranges: {
                      from: 50,
                      to: 10,
                      color: "#eababa",
                    },
                  },
                },
              },
              xaxis: {
                categories: json.keywords[0],
              },
              title: {
                text: "Top 10 topics",
              },
            },
            isLoaded: true,
          },
          display("topic", json.keywords[0][0], year)
        );
      });
  }

  render() {
    var {
      selectValue,
      selectyear,
      secondchart,
      isLoaded,
      options,
      options1,
      series,
      series1,
      active1,
      active2,
      showViz,
      imageTooltipOpen,
    } = this.state;

    const yeardata = this.props.confEvents; // BAB years/data can be passed in props with the conference name.

    const topics = [
      {
        value: "topic",
        label: "topic",
      },
      {
        value: "keyword",
        label: "keyword",
      },
    ];

    if (isLoaded) {
      return (
        <div>
          <Form role="form">
            <FormGroup>
              <h2> Top 10 topics/keywords </h2>
              <p>
                The bar chart displays the top 10 topics/keywords for the
                selected event and its corresponding publications
              </p>
              <Label>Select an Event</Label>
              <br></br>
              <div style={{ width: "200px" }}>
                <Select
                  placeholder="Select Option"
                  options={yeardata}
                  value={yeardata.find((obj) => obj.value === selectyear)}
                  onChange={this.selectYear}
                />
              </div>
              <br></br>
              <br />
              <Button
                outline
                color="primary"
                active={active1}
                onClick={this.selectValue}
              >
                Topic
              </Button>
              <Button
                outline
                color="primary"
                active={active2}
                onClick={this.selectKeyword}
              >
                Keyword
              </Button>
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
              ></i>
              {this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    left: "250px",
                    top: "5px",
                    position: "relative",
                    width: "500px",
                    color: "#8E8E8E",
                    height: "50px",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    The charts are displayed based on the frequency of
                    topic/keyword
                  </p>

                  {/* <p> Click on the bar to view publications related to topic/keyword</p>
                            <p>Click on the bar of publications visualization to view the publication in semantic scholar</p> */}
                </div>
              )}
            </FormGroup>
          </Form>
          <Row>
            <Col>
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={400}
              />
              <div style={{ marginLeft: "140px", textAlign: "center" }}>
                Weight
              </div>
            </Col>
            <Col>
              {secondchart ? (
                <>
                  <ReactApexChart
                    options={options1}
                    series={series1}
                    type="bar"
                    height={400}
                  />
                  <div style={{ marginLeft: "30px", textAlign: "center" }}>
                    Count
                  </div>
                </>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <>
          <Form role="form">
            <FormGroup>
              <h2> Top 10 topics/keywords </h2>
              <p>
                The bar chart displays the top 10 topics/keywords for the
                selected event and its corresponding publications
              </p>

              <Label>Select an Event</Label>
              <br></br>
              <div style={{ width: "200px" }}>
                <Select
                  placeholder="Select Option"
                  options={yeardata}
                  value={yeardata.find((obj) => obj.value === selectyear)}
                  onChange={this.selectYear}
                />
              </div>
              <br></br>
              <br />
              <Button
                outline
                color="primary"
                active={active1}
                onClick={this.selectValue}
              >
                Topic
              </Button>
              <Button
                outline
                color="primary"
                active={active2}
                onClick={this.selectKeyword}
              >
                Keyword
              </Button>
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => this.handleToogle(true)}
                onMouseOut={() => this.handleToogle(false)}
              ></i>
              {this.state.imageTooltipOpen && (
                <div
                  className="imgTooltip"
                  style={{
                    left: "250px",
                    top: "5px",
                    position: "relative",
                    width: "500px",
                    color: "#8E8E8E",
                    height: "50px",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    The charts are displayed based on the frequency of
                    topic/keyword
                  </p>

                  {/* <p> Click on the bar to view publications related to topic/keyword</p>
                            <p>Click on the bar of publications visualization to view the publication in semantic scholar</p> */}
                </div>
              )}
            </FormGroup>
          </Form>
        </>
      );
    }
  }
}

export default TopicBar;
