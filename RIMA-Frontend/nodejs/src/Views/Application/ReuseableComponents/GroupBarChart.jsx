import React from "react";
import ReactApexChart from "react-apexcharts";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";

const GroupBarChart = ({ options, series }) => {

  return (
    <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
      <Paper style={{ width: "100%", borderRadius: "40px", padding: "1%" }}>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </Paper>
    </Grid>
  );
};

export default GroupBarChart;
