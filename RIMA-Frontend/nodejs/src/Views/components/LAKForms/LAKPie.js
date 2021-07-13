//Done by Swarna
import React, {Component} from "react";
import Select from "react-select";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  Col,
  ModalHeader,
  Row,
} from "reactstrap";
import "d3-transition";
import {BASE_URL_CONFERENCE} from "../../../Services/constants";
import Highlighter from "react-highlight-words";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

/* Chart code */
// Themes begin
// Themes end
import {Button, Label, FormGroup, Form} from "reactstrap";
import ReactApexChart from "react-apexcharts";

class LAKPie extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.selectYear = this.selectYear.bind(this);
    this.selectKey = this.selectKey.bind(this);
    this.selectNumber = this.selectNumber.bind(this);
    this.displayAbstract = this.displayAbstract.bind(this);
    this.state = {
      selectnum: "",
      selectValue: "",
      items: [],
      weights: [],
      isLoaded: false,
      series: [],
      url: "",
      highlightText: "",
      modalTitle: [],
      modalBody: [],
      selectyear: "",
      active1: true,
      active2: false,
      modal: false,
      options: {},
    };
  }

  displayAbstract(param) {
    fetch(
      `${BASE_URL_CONFERENCE}` +
      "getabstractdetails/" + this.props.conferenceName + "/"+
      param +
      "/" +
      this.state.selectyear
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          modal: true,
          scroll: true,
          highlightText: param,
          modalTitle: json,
          modalBody: json,
          url: 'https://www.semanticscholar.org/search?year%5B0%5D=' + json[0].year + '&year%5B1%5D=' + json[0].year + '&venue%5B0%5D=' + json[0].venue + '&q=' + param + '&sort=relevance'


          // modalHeader:json.abstractview[2],
        });
      });
  }

  toggle = (id) => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  selectNumber(e) {
    this.setState({
      selectnum: e.value,
    });
  }

  handleToogle = (status) => {
    this.setState({imageTooltipOpen: status});
    console.log(this.state.imageTooltipOpen);
  };

  componentDidMount() {
    //console.log("the json is ******************")
    const displayabstract = this.displayAbstract;
    fetch(BASE_URL_CONFERENCE + "gettopicsforpie/lak/10/2011")
      .then((response) => response.json())

      .then((json) => {
        console.log("", json);
        this.setState({
          selectnum: "10",
          selectyear: "2011",
          series: json.weights,
          options: {
            chart: {
              type: "donut",
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  console.log(
                    chartContext.w.config.labels[config.dataPointIndex]
                  );
                  var topic =
                    chartContext.w.config.labels[config.dataPointIndex];
                  displayabstract(topic);
                },
              },
            },
            labels: json.words,
            tooltip: {
              custom: function ({series, seriesIndex, dataPointIndex, w}) {
                console.log(w.config);
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.config.labels[seriesIndex] +
                  "</span>" +
                  "</div>"
                );
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
          isLoaded: true,
        });
      });
  }

  selectYear(e) {
    this.setState({
      selectyear: e.value,
    });
  }

  selectValue(e) {
    const displayabstract = this.displayAbstract;

    fetch(
      BASE_URL_CONFERENCE +
      "gettopicsforpie/topic/"+
      this.state.selectnum +
      "/" +
      this.state.selectyear
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          active1: true,
          active2: false,

          series: json.weights,
          options: {
            chart: {
              type: "donut",
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  console.log(
                    chartContext.w.config.labels[config.dataPointIndex]
                  );
                  var topic =
                    chartContext.w.config.labels[config.dataPointIndex];
                  displayabstract(topic);
                },
              },
            },
            labels: json.words,
            tooltip: {
              custom: function ({series, seriesIndex, dataPointIndex, w}) {
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.config.labels[seriesIndex] +
                  "</span>" +
                  "</div>"
                );
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
          isLoaded: true,
        });
      });
  }

  selectKey(e) {
    const displayabstract = this.displayAbstract;
    fetch(
      BASE_URL_CONFERENCE +
      "getkeysforpie/keyword/"+
      this.state.selectnum +
      "/" +
      this.state.selectyear
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          active1: false,
          active2: true,
          series: json.weights,
          options: {
            chart: {
              type: "donut",
              events: {
                dataPointSelection: function (event, chartContext, config) {
                  console.log(
                    chartContext.w.config.labels[config.dataPointIndex]
                  );
                  var topic =
                    chartContext.w.config.labels[config.dataPointIndex];
                  displayabstract(topic);
                },
              },
            },
            labels: json.words,
            tooltip: {
              custom: function ({
                                  labels,
                                  series,
                                  seriesIndex,
                                  dataPointIndex,
                                  w,
                                }) {
                return (
                  '<div class="arrow_box">' +
                  "<span>" +
                  w.config.labels[seriesIndex] +
                  "</span>" +
                  "</div>"
                );
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
          isLoaded: true,
        });
      });
  }

  render() {
    var {
      selectValue,
      items,
      weights,
      isLoaded,
      selectyear,
      selectnum,
      active1,
      active2,
      modalTitle,
      highlightText,
      url,
      modalBody,
    } = this.state;

    const yeardata =  this.props.confEvents; // BAB 09.06.2021  years/data can be passed in props with the conference name. 


    const numbers = [
      {
        value: "5",
        label: "5",
      },
      {
        value: "10",
        label: "10",
      },
    ];


    //var{items,arr_keys,arr_vals}=this.state;

    if (isLoaded) {
      return (
        <>
          {console.log("the values are:", items)}
          {console.log("the values are:", weights)}
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Topic distribution</h2>
              <br/>
              <p>
                The pie chart displays the distribution of top 5/10
                topics/keywords for the selected conference
              </p>
              <Label>Select a year</Label>
              <div style={{width: "200px"}}>
                <Select
                  placeholder="Select Option"
                  options={yeardata}
                  value={yeardata.find((obj) => obj.value === selectyear)}
                  onChange={this.selectYear}
                />
              </div>
              <br/>
              <Label>Select the number of topics/keywords</Label>
              <br/>
              <div style={{width: "200px"}}>
                <Select
                  placeholder="Select Option"
                  options={numbers}
                  value={numbers.find((obj) => obj.value === selectnum)}
                  onChange={this.selectNumber}
                />
              </div>
              <br/>

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
                    left: "250px",
                    top: "5px",
                    position: "relative",
                    width: "500px",
                    color: "#8E8E8E",
                    height: "60px",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    Click on a sector of pie chart to view more details or
                    double click the legend
                  </p>

                  {/* <p> Click on the bar to view publications related to topic/keyword</p>
                            <p>Click on the bar of publications visualization to view the publication in semantic scholar</p> */}
                </div>
              )}
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="donut"
                height={300}
              />
            </FormGroup>
          </Form>
          <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" scrollable={false}>
              <ModalHeader toggle={this.toggle}><h2>
                <Highlighter
                  highlightClassName="YourHighlightClass"
                  searchWords={[highlightText]}
                  autoEscape={true}
                  textToHighlight={"List of Publications related to the topic/keyword '" + highlightText + "'"}
                /></h2></ModalHeader>
              <ModalBody>
                <br/>
                <br/>
                <Table hover size="20">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Abstract</th>
                  </tr>
                  </thead>
                  <tbody>
                  {console.log("the title is:", modalTitle)}
                  {modalTitle.map((text, index) => (
                     <tr>
                      <td>{index + 1}</td>
                      <td style={{'whiteSpace': 'unset'}}><p><Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[highlightText]}
                        autoEscape={true}
                        textToHighlight={text.title}
                      /></p></td>
                      <td style={{'whiteSpace': 'unset'}}><Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[highlightText]}
                        autoEscape={true}
                        textToHighlight={text.abstarct}
                        /></td>
                      </tr>
                  ))}
                  </tbody>
                </Table>

              </ModalBody>
              <ModalFooter>
                <Row>
                  <Col>
                    <Button color="info"> <a style={{'color': 'white'}} href={url} target="_blank">Search in Semantic
                      Scholar</a></Button>
                  </Col>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col/>
                  <Col>
                    <Button color="secondary" onClick={this.toggle}>Close</Button>
                  </Col>
                </Row>
              </ModalFooter>
            </Modal>
        </>
      );
    } else {
      return (
        <>
          <Form role="form" method="POST">
            <FormGroup>
              <h2>Topic distribution</h2>
              <br/>
              <p>
                The pie chart displays the distribution of top 5/10
                topics/keywords for the selected conference
              </p>
              <Label>Select a year</Label>
              <div style={{width: "200px"}}>
                <Select
                  placeholder="Select Option"
                  options={yeardata}
                  value={yeardata.find((obj) => obj.value === selectyear)}
                  onChange={this.selectYear}
                />
              </div>
              <br/>
              <Label>Select the number of topics/keywords</Label>
              <br/>
              <div style={{width: "200px"}}>
                <Select
                  placeholder="Select Option"
                  options={numbers}
                  value={numbers.find((obj) => obj.value === selectnum)}
                  onChange={this.selectNumber}
                />
              </div>
              <br/>
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
                    left: "250px",
                    top: "5px",
                    position: "relative",
                    width: "500px",
                    color: "#8E8E8E",
                    height: "55px",
                    border: "1px solid #BDBDBD",
                  }}
                >
                  <p>
                    Click on a sector of pie chart to view more details or
                    double click the legend
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

export default LAKPie;
