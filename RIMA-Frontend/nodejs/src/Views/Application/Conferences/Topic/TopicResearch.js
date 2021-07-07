import React from "react";
import Chart from "chart.js";
import Select from "react-select";
import WordCloud from "../../../components/LAKForms/WordCloud";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  Button
} from "reactstrap";
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import TopicBar from "../../../components/LAKForms/TopicBar";
import LAKPie from "../../../components/LAKForms/LAKPie";
import LAKStackedAreaChart from "../../../components/LAKForms/LAKStackedAreaChart";
import VennChart from "../../../components/LAKForms/VennChart";
import LAKStackedBarChart from "../../../components/LAKForms/LAKStackedBarChart";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";

// BAB:BEGIN 08/06/2021 :: cover other conferences.
import {BASE_URL_CONFERENCE} from "../../../../Services/constants";

// years and conferences' names should be fetched later from a customed endpoint

// BAB:END 08/06/2021 :: cover other conferences.

class TopicResearch extends React.Component {
  constructor(props) {
    super(props);
    this.navigateTop = this.navigateTop.bind(this);
    this.state = {
      activeNav: 4,
      chartExample1Data: "data1",
      tooltipOpen: false,
      imageTooltipOpen: false,
      // BAB:BEGIN 08/06/2021 :: cover other conferences
      selectedOption: { label: 'LAK', value: 'LAK' },  
      confEvents: [
        {
          value: "2011",
          label: "2011"
        },
        {
          value: "2012",
          label: "2012"
        },
        {
          value: "2013",
          label: "2013"
        },
        {
          value: "2014",
          label: "2014"
        },
        {
          value: "2015",
          label: "2015"
        },
        {
          value: "2016",
          label: "2016"
        },
        {
          value: "2017",
          label: "2017"
        },
        {
          value: "2018",
          label: "2018"
        },
        {
          value: "2019",
          label: "2019"
        },
        {
          value: "2020",
          label: "2020"
        }
      ],
      conference : [
        { value: 'LAK', label: 'LAK' },
        { value: 'edm', label: 'edm' },
        { value: 'aied', label: 'aied'},
      ],
  
      // BAB:END 08/06/2021 :: cover other conferences.
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  navigateTop() {
    window.scrollTo(0, 0)
  }

   // BAB:BEGIN 08/06/2021 :: cover other conferences.
  handleChange = selectedOption => {
    this.forceUpdate();
    this.setState({ selectedOption });
    console.log("updated");
    console.log(`Option selected:`, selectedOption);
    fetch(`${BASE_URL_CONFERENCE}confEvents/${selectedOption.value}`)
    .then(response => response.json())
    .then(json => {
      this.setState({
        confEvents: json.years,
      })
    });
  };
  // BAB:END 08/06/2021 :: cover other conferences.

  render() {
    const { selectedOption } = this.state;   // BAB 08/06/2021 :: cover other conferences.
    return (
      <>
        {/* Page content */}
        <Container className="mt--7" fluid style={{maxWidth: "1400px"}}>
          <Card className="bg-gradient-default1 shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div
                  className="col"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "1000",
                    width: "5000",
                  }}
                >
                  <div>
                    <h2 className="text-white1 mb-0">Comparison of Conference(s)</h2>
                    <p>
                    The following visualizations compare the topics of conference over multiple years

                    </p>
                    <div style={{marginLeft: "40px"}}>
                      <Label>Select conference</Label>
                      <br></br>
                      <div style={{width: "200px"}}>
                        <Select
                        // BAB:BEGIN 08/06/2021 :: cover other conferences.
                          placeholder="Select conference"
                          options={this.state.conference}
                          value={selectedOption}
                          onChange={this.handleChange}
                        // BAB:END 08/06/2021 :: cover other conferences.
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
              <Row>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "600px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                                        

                    <Col>
                      <TopicBar conferenceName = {selectedOption.value} confEvents = {this.state.confEvents} />          {/*  BAB 08.06.2021 */ }
                    </Col>
                  </div>
                </div>
                <br></br>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "700px",
                      width: "830px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <LAKPie conferenceName = {selectedOption.value}  confEvents = {this.state.confEvents}/>       {/*  BAB 08.06.2021 */ } 
                    </Col>
                  </div>
                </div>
                <br></br>
                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "1000px",
                      width: "800px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <LAKStackedBarChart  conferenceName = {selectedOption.value} confEvents = {this.state.confEvents}/>    {/*  BAB 08.06.2021 */ }
                    </Col>
                  </div>
                </div>
                <br></br>
                <div
                  className="row mt-4"
                  style={{
                    height: "750px",
                    width: "830px",
                    backgroundColor: "#F0F8FF",
                    marginLeft: "50px",
                    borderRadius: "2px",
                  }}
                >
                  <Col>
                    <LAKStackedAreaChart  conferenceName = {selectedOption.value} />   {/*  BAB 08.06.2021 */ } 
                  </Col>
                </div>

                <div className="main">
                  <div
                    className="row mt-4"
                    style={{
                      height: "900px",
                      width: "800px",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "50px",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <VennChart  conferenceName = {selectedOption.value} confEvents = {this.state.confEvents}  page = 'topicreasearch' conferences = {this.state.conference}/>     {/*  BAB 08.06.2021 */ } 
                    </Col>
                  </div>
                </div>
              </Row>
              {/*<Row>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  <Col></Col>*/}
              {/*  */}
              {/*  <Col><div><br></br><Button color="primary" onClick=*/}
              {/*  {this.navigateTop}><i title="Navigate to top of the page"*/}
              {/*  className="fas fa-arrow-up text-white"*/}
              {/*  */}
              {/*></i></Button></div></Col>*/}
              {/*</Row>*/}
            </CardHeader>

            <ScrollTopWrapper/>
          </Card>
        </Container>

      </>
    );
  }
}

export default TopicResearch;
