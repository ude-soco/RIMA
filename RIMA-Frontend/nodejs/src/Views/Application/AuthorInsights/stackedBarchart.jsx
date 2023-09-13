import { Grid } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import ReactApexChart from "react-apexcharts";

const StackedBarChart = ({ DataProps, loader }) => {
  const [chartData, setChartData] = useState(DataProps);
  useEffect(() => {
    setChartData(DataProps);
  }, [DataProps]);
  return (
    <Grid container xs={12} style={{ padding: "2%", marginTop: "2%" }}>
      <ActiveLoader height={50} width={50} visible={loader} />
      <Grid item xs={12}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width="100%"
          height={350}
        />
      </Grid>
    </Grid>
  );
};

export default StackedBarChart;
