//Done by Swarna
import React from "react";
import Chart from "chart.js";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import VennChart from "../../../components/LAKForms/VennChart";
import LAKStackedBarChart from "../../../components/LAKForms/LAKStackedBarChart";
import CoolTabs from "react-cool-tabs";
import LAKAuthorsbar from "../../../components/LAKForms/LAKAuthorsbar";

class TopicComparisions extends React.Component {
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
    return (
      <>

        {/* Page content */}
        <Container  fluid>
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
                        <h2 className="text-white1 mb-0">Topic Overview</h2>
                        <p>
                          The visualizations gives an insight of topics through
                          different criteria
                          <CoolTabs
                            tabKey={"1"}
                            style={{
                              width: 850,
                              height: 3000,
                              background: "white",
                            }}
                            activeTabStyle={{
                              background: "#338EFF",
                              color: "white",
                            }}
                            unActiveTabStyle={{
                              background: "white",
                              color: "black",
                            }}
                            activeLeftTabBorderBottomStyle={{
                              background: "white",
                              height: 4,
                            }}
                            activeRightTabBorderBottomStyle={{
                              background: "white",
                              height: 4,
                            }}
                            tabsBorderBottomStyle={{
                              background: "#338EFF",
                              height: 4,
                            }}
                            leftContentStyle={{background: "white"}}
                            rightContentStyle={{background: "white"}}
                            leftTabTitle={"Conferences"}
                            rightTabTitle={"Researchers"}
                            leftContent={
                              <Row>
                                <div class="main">
                                  <div
                                    class="row mt-4"
                                    style={{
                                      height: "900px",
                                      width: "800px",
                                      "background-color": "#F1F1F1",
                                      "margin-left": "50px",
                                      "border-radius": "2px",
                                    }}
                                  >
                                    <Col>
                                      <VennChart/>
                                    </Col>
                                  </div>
                                </div>

                                <div className="main">
                                  <div
                                    className="row mt-4"
                                    style={{
                                      height: "1000px",
                                      width: "800px",
                                      backgroundColor: "#F1F1F1",
                                      marginLeft: "50px",
                                      borderRadius: "2px",
                                    }}
                                  >
                                    <Col>
                                      <LAKStackedBarChart/>
                                    </Col>
                                  </div>
                                </div>
                                <div className="main">
                                  <div
                                    className="row mt-4"
                                    style={{
                                      height: "1000px",
                                      width: "800px",
                                      backgroundColor: "#F1F1F1",
                                      marginLeft: "50px",
                                      borderRadius: "2px",
                                    }}
                                  >
                                    <Row>
                                      <Col>

                                      </Col>
                                    </Row>
                                  </div>
                                </div>
                              </Row>
                            }
                            rightContent={
                              <div>
                                <br/>
                                <h3>Researcher Collaboration Network</h3>
                                <br/>
                                <Row>
                                  <Col>

                                  </Col>
                                </Row>
                                <br/>

                                <Row>
                                  <Col>
                                    <LAKAuthorsbar/>
                                  </Col>
                                </Row>
                              </div>
                            }
                            contentTransitionStyle={"transform 0.6s ease-in"}
                            borderTransitionStyle={"all 0.6s ease-in"}
                          />
                        </p>
                      </div>
                    </div>
                  </Row>
                  <Row/>
                </CardHeader>

                <CardBody/>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default TopicComparisions;
