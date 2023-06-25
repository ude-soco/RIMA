import React from "react";
import ReactApexChart from "react-apexcharts";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";

const MostPopularKeyphraseInConf = () => {
  const [series, setSeries] = useState([
    {
      name: "analytics",
      data: [20, null, null, null, 15, 20, null, null, null, 15],
    },
    { name: "AI", data: [10, null, null, 20, 25, 10, null, null, 20, 25] },
    { name: "ML", data: [15, null, 30, null, 10, 20, null, null, 20, 10] },
    {
      name: "Learning",
      data: [20, null, null, 20, 10, 15, null, 30, null, 10],
    },
  ]);
  const colors = ["#008FFB"];
  const plotOptions = {
    bar: {
      horizontal: false,
      dataLabels: { position: "top" },
      columnWidth: "70%",
      barGap: "0%",
      distributed: false,
    },
  };
  const [options, setOptions] = useState({
    chart: { type: "bar", height: 350 },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });

  const getPublicationsCounts = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationsConfCount/" + "lak"
    );
    const response = await request.json();
    console.log("response", response);
    setSeries(response.data);
    setOptions({
      chart: { type: "bar", height: 350 },
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { position: "top" },
          columnWidth: "70%",
        },
      },
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c49c94",
      ],
      xaxis: {
        categories: response.years,
      },
    });
  };

  useEffect(() => getPublicationsCounts(), []);
  return (
    <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            Conference topics evolution
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            The top 5 topics based on number of relevant publications in each
            conference event over time
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
        <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
          <Paper style={{ width: "100%", borderRadius: "40px", padding: "1%" }}>
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </Paper>
        </Grid>
        <Paper style={{ width: "100%", borderRadius: "40px", padding: "1%" }}>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MostPopularKeyphraseInConf;
