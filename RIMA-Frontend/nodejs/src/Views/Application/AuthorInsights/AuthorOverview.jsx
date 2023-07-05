import { Grid } from "@mui/material";
import React from "react";
import GroupBarChart from "../ReuseableComponents/GroupBarChart";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";

const AuthorOverview = ({ authorNameProps }) => {
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loader, setLoader] = useState(false);
  const [series, setSeries] = useState([
    {
      data: [1, 0, 0, 0, 3, 2, 0, 0, 0, 0],
    },
  ]);
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
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedYear = config.w.globals.labels[config.dataPointIndex];
          const selectedword = config.w.config.series[config.seriesIndex].name;
          setSelectedEvent(selectedYear);
        },
      },
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });
  useEffect(() => {
    console.log("authorNameProps: ", authorNameProps);
    getAuthorPublicationList();
  }, [authorNameProps]);

  useEffect(() => {
    console.log("authorNameProps: ", authorNameProps);
    getAuthorPublicationList();
  }, []);
  const getAuthorPublicationList = async () => {
    setLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorPublicationsOverYears/" + authorNameProps
    );
    const response = await request.json();
    console.log("request count", { data: response.count });
    console.log("request years", response.years);
    setSeries([
      {
        data: response.count,
      },
    ]);
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
    <Grid>
      <GroupBarChart options={options} series={series} loader={loader} />
    </Grid>
  );
};
export default AuthorOverview;
