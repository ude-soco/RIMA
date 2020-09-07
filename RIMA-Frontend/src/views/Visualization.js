
import React from "react";
import Chart from "chart.js";
import PieChart from "../components/Chart/PieChart"
import BarChart from "../components/Chart/BarChart"
import CloudChart from "../components/Chart/CloudChart"


import {
  Button,
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

class Visualization extends React.Component {
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
                      <h6 className="text-uppercase text-light1 ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white1 mb-0">Visualization</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div style={{ paddingLeft: '30%' }}>
                    <PieChart />

                    <BarChart />
                  </div>
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

export default Visualization;













