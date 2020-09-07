import React from "react";
import Chart from "chart.js";
import CloudChart from "../components/Chart/CloudChart";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

// core components
import { chartOptions, parseOptions } from "variables/charts.js";

import Header from "components/Headers/Header.js";

class CloudChartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
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
                      <h2 className="text-white1 mb-0">Interest Overview</h2>
                      <Link
                        to="/app/Keyword"
                        className=" ls-1 mb-1"
                        style={{ lineHeight: "2" }}
                      >
                        Edit Keywords
                      </Link>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div>Word Cloud</div>
                  <p>
                    This word cloud shows the top 15 interests based on your
                    published paper/tweets. By hovering your mouse over a word
                    to see its source. You can also click the word to see from
                    which paper/tweet we got this interest.
                  </p>
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
