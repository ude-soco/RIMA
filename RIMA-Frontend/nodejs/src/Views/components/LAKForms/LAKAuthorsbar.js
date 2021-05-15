//Done by Swarna
import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Select from "react-select";
import "./styles.css";
import ReactApexChart from "react-apexcharts";
import { Row, Col, Label, Badge, Button } from "reactstrap";
import { BASE_URL_INTEREST } from "../../../Services/constants";

class LAKAuthorsbar extends Component {
  constructor(props) {
    super(props);
    this.selectyearValue = this.selectyearValue.bind(this);
    this.selectValue = this.selectValue.bind(this);
    this.selectValue1 = this.selectValue1.bind(this);
    this.selectTopic = this.selectTopic.bind(this);
    this.selectKey = this.selectKey.bind(this);

    this.state = {
      weights: [],
      years: [],
      topics: [],
      series: [],
      authors1: [],
      authors2: [],
      selectedValue: "",
      loader: false,
      display: "none",
      display1: "none",
      active1: true,
      active2: false,
      selectVal1: "",
      selectVal2: "",
      selectYear: "",
      keyvalue: "",
      url: "",
      isLoaded: false,
      graphData: [],
      commontpcs: [],
      isModalLoader: false,
    };
  }

  selectValue1(e) {
    this.setState({
      selectVal1: e.value,
    });
  }
  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
    console.log(this.state.imageTooltipOpen);
  };
  selectTopic(e) {
    console.log(this.state.selectValue);
    this.setState({
      active1: true,
      active2: false,
      display: "none",
      display1: "block",
      loader: true,
    });

    fetch(
      BASE_URL_INTEREST +
        "getauthortopicdetails/?" +
        this.state.selectVal1 +
        "&" +
        this.state.selectVal2 +
        "&" +
        this.state.selectYear +
        "&" +
        e.target.value
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        console.log("auth", json.authortopics[0]);
        for (let i = 0; i < json.authortopics[0].length; i++) {
          series = series.concat([
            { name: json.authortopics[0][i], data: json.authortopics[1][i] },
          ]);
          //selectInputRef1.current.chart.publicMethods.updateOptions({})
        }
        this.setState({
          series: series,

          options: {
            colors: [
              "#00FFFF",
              "#7FFFD4",
              "#FFE4C4",
              "#0000FF",
              "#D2691E",
              "#00008B",
              "#A9A9A9",
              "#BDB76B",
              "#FF8C00",
              "#9400D3",
              "#FF00FF",
              "#FFD700",
              "#DC143C",
              "#FFDAB9",
              "#D2B48C",
              "#B0C4DE",
              "#000000",
              "#00FA9A",
              "#DAA520",
              "#ADFF2F",
            ],
            chart: {
              type: "bar",
              height: 300,
              stacked: true,
              stackType: "100%",
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
              categories: json.authortopics[2],
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
          years: json.authortopics[2],
          commontpcs: json.authortopics[3],
          isLoaded: true,
          loader: false,
          display: "block",
          display1: "none",
        });
      });
  }
  componentWillMount() {
    fetch(BASE_URL_INTEREST + "getauthorsyearlist/all years")
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectYear: "all years",
          authors1: json.authors.sort((a, b) => (a.label > b.label ? 1 : -1)),
          authors2: json.authors.sort((a, b) => (a.label > b.label ? 1 : -1)),
        });
      });

    this.setState({
      display: "none",
      display1: "block",
      loader: true,
    });

    fetch(
      BASE_URL_INTEREST +
        "getauthortopicdetails/?A. A. Economides&A. Ammari&all years&topic"
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        console.log("auth", json.authortopics[0]);
        for (let i = 0; i < json.authortopics[0].length; i++) {
          series = series.concat([
            { name: json.authortopics[0][i], data: json.authortopics[1][i] },
          ]);
          //selectInputRef1.current.chart.publicMethods.updateOptions({})
        }
        this.setState({
          selectVal1: "A. A. Economides",
          selectVal2: "A. Ammari",
          series: series,

          options: {
            colors: [
              "#00FFFF",
              "#7FFFD4",
              "#FFE4C4",
              "#0000FF",
              "#D2691E",
              "#00008B",
              "#A9A9A9",
              "#BDB76B",
              "#FF8C00",
              "#9400D3",
              "#FF00FF",
              "#FFD700",
              "#DC143C",
              "#FFDAB9",
              "#D2B48C",
              "#B0C4DE",
              "#000000",
              "#00FA9A",
              "#DAA520",
              "#ADFF2F",
            ],
            chart: {
              type: "bar",
              height: 300,
              stacked: true,
              stackType: "100%",
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
              categories: json.authortopics[2],
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                console.log(w.globals.seriesNames[seriesIndex])
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.globals.seriesNames[seriesIndex] +
                  "<br></br></span>" +
                  "</div>"
                );
              },
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
          years: json.authortopics[2],
          commontpcs: json.authortopics[3],
          isLoaded: true,
          loader: false,
          display: "block",
          display1: "none",
        });
      });
  }
  selectKey(e) {
    this.setState({
      display: "none",
      display1: "block",
      loader: true,
    });

    fetch(
      BASE_URL_INTEREST +
        "getauthortopicdetails/?" +
        this.state.selectVal1 +
        "&" +
        this.state.selectVal2 +
        "&" +
        this.state.selectYear +
        "&" +
        e.target.value
    )
      .then((response) => response.json())
      .then((json) => {
        var series = [];
        console.log("auth", json.authortopics[0]);
        for (let i = 0; i < json.authortopics[0].length; i++) {
          series = series.concat([
            { name: json.authortopics[0][i], data: json.authortopics[1][i] },
          ]);
          //selectInputRef1.current.chart.publicMethods.updateOptions({})
        }
        this.setState({
          selectValue: e.value,
          series: series,

          options: {
            colors: [
              "#00FFFF",
              "#7FFFD4",
              "#FFE4C4",
              "#0000FF",
              "#D2691E",
              "#00008B",
              "#A9A9A9",
              "#BDB76B",
              "#FF8C00",
              "#9400D3",
              "#FF00FF",
              "#FFD700",
              "#DC143C",
              "#FFDAB9",
              "#D2B48C",
              "#B0C4DE",
              "#000000",
              "#00FA9A",
              "#DAA520",
              "#ADFF2F",
            ],
            chart: {
              type: "bar",
              height: 300,
              stacked: true,
              stackType: "100%",
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
              categories: json.authortopics[2],
              labels: {
                style: {},
              },
            },
            tooltip: {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                console.log(w.globals.seriesNames[seriesIndex])
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.globals.seriesNames[seriesIndex] +
                  "<br></br></span>" +
                  "</div>"
                );
              },
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
          years: json.authortopics[2],
          commontpcs: json.authortopics[3],
          isLoaded: true,
          loader: false,
          active1: false,
          active2: true,
          display: "block",
          display1: "none",
        });
      });
  }

  selectValue(e) {
    this.setState({
      selectVal2: e.value,
    });
  }

  selectyearValue(e) {
    fetch(BASE_URL_INTEREST + "getauthorsyearlist/" + e.value)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          selectYear: e.value,
          authors1: json.authors.sort((a, b) => (a.label > b.label ? 1 : -1)),
          authors2: json.authors.sort((a, b) => (a.label > b.label ? 1 : -1)),
        });
      });
  }
  render() {
    var {
      isLoaded,
      selectYear,
      authors1,
      authors2,
      selectVal1,
      commontpcs,
      selectVal2,
      display,
      loader,
      display1,
      active1,
      active2,
    } = this.state;

    const yeardata = [
      {
        value: "all years",
        label: "all years",
      },
      {
        value: "2011",
        label: "2011",
      },
      {
        value: "2012",
        label: "2012",
      },
      {
        value: "2013",
        label: "2013",
      },
      {
        value: "2014",
        label: "2014",
      },
      {
        value: "2015",
        label: "2015",
      },
      {
        value: "2016",
        label: "2016",
      },
      {
        value: "2017",
        label: "2017",
      },
      {
        value: "2018",
        label: "2018",
      },
      {
        value: "2019",
        label: "2019",
      },
      {
        value: "2020",
        label: "2020",
      },
    ];

    var url =
      "https://www.semanticscholar.org/search?author=" +
      selectVal1 +
      "&author=" +
      selectVal2 +
      "&q=";

    if (isLoaded) {
      return (
        <div className="App" style={{ height: "1000px", width: "700px" }}>
          <div style={{ marginLeft: "30px" }}>
            <h3>Comparison of topics/keywords between researchers</h3>
            <br></br>

            <p>
              This visualization displays the comparison of topics/keywords
              between two researchers
            </p>
            <br></br>
            {/* <Select  
                placeholder="Select option"
                options={keywords}
                value={keywords.find((obj) => obj.value === keyvalue)}
                onChange={this.selectKeyValue}
              /> */}

            <Label>Select a year</Label>
            <div style={{ width: "315px" }}>
              <Select
                placeholder="Select Year"
                options={yeardata}
                value={yeardata.find((obj) => obj.value === selectYear)}
                onChange={this.selectyearValue}
              />
            </div>
            <br></br>
            <Label>Select two researchers to compare</Label>
            <br></br>

            <Row>
              <Col>
                <Select
                  placeholder="Researcher1"
                  options={authors1}
                  value={authors1.find((obj) => obj.value === selectVal1)}
                  onChange={this.selectValue1}
                />
              </Col>
              <Col>
                <Select
                  placeholder="Researcher2"
                  options={authors2}
                  value={authors2.find((obj) => obj.value === selectVal2)}
                  onChange={this.selectValue}
                />
              </Col>

              <br></br>
            </Row>

            <br></br>
            <Button
              outline
              color="primary"
              active={active1}
              value="topic"
              onClick={this.selectTopic}
            >
              Topic
            </Button>
            <Button
              outline
              value="keyword"
              active={active2}
              color="primary"
              onClick={this.selectKey}
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
                  marginTop: "0px",
                  position: "relative",
                  left: "205px",
                  width: "500px",
                  height: "40px",
                  color: "#8E8E8E",
                  border: "1px solid #BDBDBD",
                }}
              >
                <p>Each part in a bar represents a specific topic/keyword</p>
              </div>
            )}
            <br></br>
            <br></br>
            <div
              style={{
                backgroundColor: "white",
                display: display1,
                position: "absolute",
                width: "100px",
                marginLeft: "300px",
                marginTop: "100px",
              }}
            >
              <Loader
                type="Bars"
                visible={loader}
                color="#00BFFF"
                height={100}
                width={100}
              ></Loader>
            </div>
            <div style={{ display: display }}>
              <h5>Common topics/keywords</h5>
              {commontpcs.length == 0 ? (
                <div>No common topics/keywords found</div>
              ) : (
                commontpcs.map((number) => (
                  <Badge
                    href={url + number}
                    target="_blank"
                    color="info"
                    style={{ marginLeft: "10px" }}
                  >
                    {number}
                  </Badge>
                ))
              )}

              <br></br>
              {/* vlato,ourania */}
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className="App" style={{ height: "1000px", width: "700px" }}>
            <div style={{ marginLeft: "30px" }}>
              <h3>Comparison of topics/keywords between researchers</h3>
              <br></br>

              <p>
                This visualization displays the comparison of topics/keywords
                between two researchers
              </p>

              {/* <Select  
                placeholder="Select option"
                options={keywords}
                value={keywords.find((obj) => obj.value === keyvalue)}
                onChange={this.selectKeyValue}
              /> */}
              <Label>Select a year</Label>
              <br></br>
              <div style={{ width: "315px" }}>
                <Select
                  placeholder="Select Year"
                  options={yeardata}
                  value={yeardata.find((obj) => obj.value === selectYear)}
                  onChange={this.selectyearValue}
                />
              </div>
              <br></br>

              <Label>Select two researchers to compare</Label>
              <Row>
                <Col>
                  <Select
                    placeholder="Researcher1"
                    options={authors1}
                    value={authors1.find((obj) => obj.value === selectVal1)}
                    onChange={this.selectValue1}
                  />
                </Col>
                <Col>
                  <Select
                    placeholder="Researcher2"
                    options={authors2}
                    value={authors2.find((obj) => obj.value === selectVal2)}
                    onChange={this.selectValue}
                  />
                </Col>
              </Row>
              <br></br>

              <Button color="primary" value="topic" onClick={this.selectTopic}>
                Topic
              </Button>
              <Button color="primary" value="keyword" onClick={this.selectKey}>
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
                    marginTop: "0px",
                    position: "relative",
                    left: "205px",
                    width: "500px",
                    height: "40px",
                    color: "#8E8E8E",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>Each part in a bar represents a specific topic/keyword</p>
                </div>
              )}
              <br></br>
              <div
                style={{
                  backgroundColor: "white",
                  display: display1,
                  width: "100px",
                  marginLeft: "300px",
                  marginTop: "100px",
                  position: "absolute",
                }}
              >
                <Loader
                  type="Bars"
                  visible={loader}
                  color="#00BFFF"
                  height={100}
                  width={100}
                ></Loader>
              </div>
              <br></br>
            </div>
          </div>
        </>
      );
    }
  }
}

export default LAKAuthorsbar;
