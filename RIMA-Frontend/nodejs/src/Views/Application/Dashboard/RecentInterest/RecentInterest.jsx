import React, {useEffect, useState} from "react";
import Chart from "chart.js";
import PieChart from "../../../components/Chart/PieChart";

// core components
import {chartOptions, parseOptions} from "Services/variables/charts.js";
import {Grid, Paper, Typography} from "@material-ui/core";

export default function RecentInterest({classes}) {
  const [state, setState] = useState({
    activeNav: 1,
    chartExample1Data: "data1",
  });

  useEffect(() => {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }, [])

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
      <Grid container direction="column" component={Paper} className={classes.spacing}>
        <Grid item>
          <Typography variant="h5" gutterBottom> Recent Interest </Typography>
        </Grid>
        <Grid item>
          <Typography gutterBottom>
            This chart shows your recent interests in the last year (for publications), and last month (for tweets).
          </Typography>
        </Grid>
        <Grid item>
          <PieChart/>
        </Grid>
      </Grid>
    </>
  );
}
