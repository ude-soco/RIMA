import React from "react";
import Chart from "chart.js";
import BarChart from "../components/Chart/BarChart";
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";
// core components
import { chartOptions, parseOptions } from "variables/charts.js";
import Header from "components/Headers/Header.js";
import swal from "@sweetalert/with-react";
import "../assets/scss/custom.css";

class BarChartPage extends React.Component {
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
  // modalDetail = () => {
  //   swal(
  //     <div>
  //       <h1>How the bar chart generated?</h1>
  //       <img src={require("../assets/img/barchart.png")} />
  //     </div>
  //   );
  // };
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

                      <h2 className="text-white1 mb-0">Activities</h2>
                      <p>
                      These charts show the number of publications and tweets you have published over the last years.
                        &nbsp;
                        {/* <i
                          onClick={this.modalDetail}
                          className="fa fa-question-circle"
                        /> */}
                      </p>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <BarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default BarChartPage;
