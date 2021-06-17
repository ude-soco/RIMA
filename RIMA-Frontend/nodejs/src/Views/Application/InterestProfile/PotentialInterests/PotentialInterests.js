import React, {useEffect, useState} from "react";
import Chart from "chart.js";
import ConceptMapContainer from "../../../components/ConceptMap";
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";

// core components
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import {CardContent, Typography} from "@material-ui/core";

export default function PotentialInterests({classes}) {

  const [state, setState] = useState({
    activeNav: 1,
    chartExample1Data: "data1",
  });

  useEffect(() => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  })
  const toggleNavs = (e, index) => {
    e.preventDefault();
    setState({
      ...state,
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1",
    });
  };

  return (
    <>
        {/* Page content */}
      <Card className={classes.cardHeight}>
        <CardContent>
          <Typography variant="h5" gutterBottom> Potential Interest </Typography>
          <Typography gutterBottom>
            This chart uses your top 5 interests to infer your
            potential interests. You can see them on the right side
            of the graph.
          </Typography>

          <ConceptMapContainer />
        </CardContent>
      </Card>
      </>
    );

}
