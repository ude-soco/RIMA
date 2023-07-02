import React from "react";
import ReactApexChart from "react-apexcharts";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ActiveLoader from "../../../Application/ReuseableComponents/ActiveLoader.jsx";
import GroupBarChart from "Views/Application/ReuseableComponents/GroupBarChart";
const EvolutionOfPopularKeyphraseInConf = ({ selectedConferencesProps }) => {
  const [series, setSeries] = useState([
    {
      name: "analytics",
      data: [20, 0, 0, 0, 15, 20, 0, 0, 0, 15],
    },
    { name: "AI", data: [10, 0, 0, 20, 25, 10, 0, 0, 20, 25] },
    { name: "ML", data: [15, 0, 30, 0, 10, 20, 0, 0, 20, 10] },
    {
      name: "Learning",
      data: [20, 0, 0, 20, 10, 15, 0, 30, 0, 10],
    },
  ]);
  const [loader, setLoader] = useState(false);
  const [selectedConference, setSelectedConference] = useState(
    selectedConferencesProps
  );
  useEffect(() => {
    setSelectedConference(selectedConferencesProps);
    console.log("selected: ", selectedConference);
  }, [selectedConferencesProps]);

  useEffect(() => {
    getPublicationsCounts();
    console.log(" get publications called");
  }, [selectedConference]);

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
    chart: {
      stroke: {
        curve: "smooth",
      },
      type: "bar",
      height: 350,
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });

  const getPublicationsCounts = async () => {
    setLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getRelevantPubsCountOfConf/" + selectedConference
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
          borderRadius: 4,
          columnWidth: "75%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontWeight: 700,
          },
        },
      },
      fill: {
        opacity: 1,
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
    setLoader(false);
  };

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
            Topics Popularity Evolution in {selectedConferencesProps} Conference
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Evolution of 5 most popular topics, determined by the count of
            related publications, in each event.
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
        <GroupBarChart options={options} series={series} loader={loader} />
      </Grid>
    </Grid>
  );
};

export default EvolutionOfPopularKeyphraseInConf;
