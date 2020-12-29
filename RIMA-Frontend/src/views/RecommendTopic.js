//Done by Swarna
import React from "react";
import Chart from "chart.js";
import Select from "react-select";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
} from "reactstrap";
// core components
import { chartOptions, parseOptions } from "variables/charts.js";
import Header from "components/Headers/Header.js";
import AuthorVenn from "components/LAKForms/AuthorVenn";
//import SampleChart from "components/LAKForms/SampleChart";

class RecommendTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
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
                      }}
                    >
                      <div>
                        <h2 className="text-white1 mb-0">Recommendations</h2>

                        <p>
                          The visualization provides information on
                          recommendations showing common topics
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
                </CardHeader>

                <CardBody>
                  {/* <Row>
                  
                <Col>
                <Topicbubble/>
               </Col>
            
           
               
           
                  </Row> */}

                  <Row>
                    <div className="main">
                      <div
                        className="row mt-4"
                        style={{
                          height: "800px",
                          width: "800px",
                          backgroundColor: "#F0F8FF",
                          marginLeft: "50px",
                          borderRadius: "2px",
                        }}
                      >
                        <Col>
                          <AuthorVenn />
                        </Col>
                      </div>
                    </div>
                  </Row>

                  {/* For demo ::: */}
                  {/* <Row>
                  <div className="main">
          <div className="row mt-4" style={{'height':'800px' ,'width':'800px',
            'backgroundColor':'#F0F8FF','marginLeft':'50px',
            'borderRadius':'2px'}}>
                <Col>
                <SampleChart/>
               </Col>
            </div>
            </div>
                  </Row> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default RecommendTopic;
