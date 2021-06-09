//Done by Swarna
import React from "react";
import Chart from "chart.js";
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
// core components
import { chartOptions, parseOptions } from "Services/variables/charts.js";
import Header from "../../../components/Headers/Header.js";
import "../../../../assets/scss/custom.css";
import AuthorVenn from "../../../components/LAKForms/AuthorVenn";

class TopicFormPage extends React.Component {
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
                      }}
                    >
                      <div>
                        <h2 className="text-white1 mb-0">Topic Overview</h2>
                        <p>
                          This word cloud shows the top 10 topics for the
                          conference of the selected.
                          <p className="flex">You can : </p>
                          <li>
                            {" "}
                            Hover over the word to see the weight of a word
                          </li>
                          <p>
                            The color is just gradient based and doesn't convey
                            anything{" "}
                          </p>
                        </p>
                      </div>
                    </div>
                  </Row>
                </CardHeader>

                <CardBody>
                  <Row>
                    <AuthorVenn />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default TopicFormPage;
