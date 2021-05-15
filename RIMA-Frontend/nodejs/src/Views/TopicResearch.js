//Done by Swarna
import React from "react";
import Chart from "chart.js";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
} from "reactstrap";
import Select from "react-select";
// core components
import { chartOptions, parseOptions } from "Services/variables/charts.js";
import Header from "./components/Headers/Header.js";
import "../assets/scss/custom.css";

class TopicResearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 4,
      chartExample1Data: "data1",
      tooltipOpen: false,
      imageTooltipOpen: false,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  render() {
    const conference = [
      {
        label: "LAK",
        value: "LAK",
      },
    ];
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
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
                        <h2 className="text-white1 mb-0">
                          Comparison of Conference(s)
                        </h2>
                        <p>
                          The following visualizations compare the topics of
                          conference over multiple years
                        </p>
                        <div style={{ marginLeft: "40px" }}>
                          <Label>Select conference</Label>
                          <br></br>
                          <div style={{ width: "200px" }}>
                            <Select
                              placeholder="Select conference"
                              options={conference}
                              value={conference.find(
                                (obj) => obj.value === "LAK"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                  <Row>
                    {/* <div className="main">
            <div className="row mt-4" style={{'height':'900px' ,'width':'800px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <VennChart/>
               </Col>
            </div>
            </div>
                  <div className="main">
            <div className="row mt-4" style={{'height':'1000px' ,'width':'800px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <LAKStackedBarChart/>
               </Col>
            </div>
           
          </div> */}
                    <br></br>
                    {/* <div className="main">
          <div className="row mt-4" style={{'height':'1000px' ,'width':'800px',
            'backgroundColor':'#F1F1F1','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <Topicbubble/>
               </Col>
            </div>
          </div> */}
                  </Row>
                </CardHeader>

                <CardBody></CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default TopicResearch;
