import React from "react";
import Chart from "chart.js";
import CloudChart from "../components/Chart/CloudChart";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

// core components
import { chartOptions, parseOptions } from "variables/charts.js";

import Header from "components/Headers/Header.js";
import { getItem } from "utils/localStorage";
import swal from "@sweetalert/with-react";
import "../assets/scss/custom.css";

class CloudChartPage extends React.Component {
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
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };
  toogle = (status) => {
    this.setState({ tooltipOpen: status });
  };
  handleToogle = (status) => {
    this.setState({ imageTooltipOpen: status });
  };
  modalDetail = () => {
    swal(
      <div>
        <img
          style={{ width: "100%" }}
          src={require("../assets/img/twitter.png")}
        />
      </div>
    );
  };
  render() {
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
                        <h2 className="text-white1 mb-0">Interest Overview</h2>
                        <p>
                          This word cloud shows the top 15 interests based on
                          your published paper/tweets.
                          <p className="flex">You can : </p>
                          <li> View basic explanation through hover over a word will show the source.</li>
                          <li> View intermediate explanation through click interest keyword. </li>
                          <li>
                            View advanced explanation through click here. &nbsp;
                            <i
                              onClick={this.modalDetail}
                              className="fa fa-question-circle"
                              onMouseOver={() => this.handleToogle(true)}
                              onMouseOut={() => this.handleToogle(false)}
                            />
                          </li>
                          {this.state.imageTooltipOpen && (
                            <div
                              className="imgTooltip"
                              style={{ 
                              marginTop: "0px",
                              color: "#8E8E8E",
                              border: "1px solid #BDBDBD",
                            }}
                            >
                              Click here to show more details.
                            </div>
                          )}
                        </p>
                      </div>
                      {getItem("mId") === getItem("userId") ? (
                        <div>
                          <Link
                            to="/app/Keyword"
                            className=" ls-1 mb-1 mr-3"
                            style={{
                              lineHeight: "5",
                              width: "850px",
                              textAlign: "right",
                              color: "#DF3A01",
                            }}
                          >
                            Manage Keywords
                          </Link>
                          <i
                            className="fa fa-question-circle"
                            style={{ lineHeight: "5" }}
                            onMouseOver={() => this.toogle(true)}
                            onMouseOut={() => this.toogle(false)}
                          />
                          {this.state.tooltipOpen && (
                            <div
                              className="tooltips"
                              style={{
                                width: "500px",
                                right: "35px",
                                color: "#8E8E8E",
                                border: "1px solid #BDBDBD",
                              }}
                            >
                              If you’re not satisfied with the interest modeling
                              result, click here to generate the better interest
                              model yourself.
                            </div>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Row>
                </CardHeader>

                <CardBody>
                  <CloudChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default CloudChartPage;
