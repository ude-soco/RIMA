
import React from "react";
import Chart from "chart.js";
import StreamChart from "./components/Chart/StreamChart"



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
} from "Services/variables/charts.js";
import Header from "./components/Headers/Header";


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

        {/* Page content */}
        <Container  fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default1 shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h2 className="text-white1 mb-0">Interest Trends</h2>
                      <p>
                      These charts allow you to monitor your interests over the last years. 
                      The x-axis represents the years, and the y-axis represents the importance of the interest (the larger the area the greater the interest).
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
