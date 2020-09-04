
import React from "react";
import Chart from "chart.js";
import StreamChart from "../components/Chart/StreamChart"



import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

class StreamChartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: "data1"
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
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
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
                    <div className="col">
                      <h2 className="text-white1 mb-0">Interest Trends</h2>
                      <p>
                        In this chart you can observe how your interest evolves in the
                        past periods. The x-axis represents timescale and the size of
                        each individual stream shape is proportional to the values in each
                        interest.
                      </p>
                    </div>

                  </Row>
                </CardHeader>
                <CardBody>
                  <StreamChart />

                </CardBody>
              </Card>
            </Col>

          </Row>
        </Container>
      </>
    );
  }
}

export default StreamChartPage;
