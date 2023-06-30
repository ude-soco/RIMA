import React from "react";
import ReactApexChart from "react-apexcharts";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { useEffect } from "react";
import { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ActiveLoader from "../../Application/ReuseableComponents/ActiveLoader.jsx";
const TopicPopularityKeyphraseInCOnf = ({ selectedConferencesProps }) => {
  const [loader, setLoader] = useState(false);
  const [selectedConference, setSelectedConference] = useState(
    selectedConferencesProps
  );

  const [series, setSeries] = useState([
    {
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    },
  ]);

  useEffect(() => {
    setSelectedConference(selectedConferencesProps);
    console.log("selected: ", selectedConference);
  }, [selectedConferencesProps]);

  useEffect(() => {
    getTopPublicationsCounts();
    console.log(" get publications called");
  }, [selectedConference]);

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 380,
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },

    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
    },
    xaxis: {
      categories: [
        "data",
        "learning",
        "model",
        "models",
        "online",
        "paper",
        "student",
        "students",
        "system",
        "data",
      ],
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
    },
  });

  const getTopPublicationsCounts = async () => {
    setLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getTopPublicationsInConf/" + selectedConference
    );
    const response = await request.json();

    var names = response.names;
    var values = response.values;
    console.log("names: ", names);
    console.log("values: ", values);

    setOptions({
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      xaxis: {
        categories: names,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    });
    setSeries([values]);

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
            Top Popular Topics in {selectedConferencesProps} Conference
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            The 10 most popular topics, determined by the count of related
            publications, in {selectedConferencesProps} conference.
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
        <Paper
          style={{ width: "100%", borderRadius: "40px", padding: "1%" }}
          elevation={10}
        >
          <ActiveLoader height={50} width={50} visible={loader} />
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

export default TopicPopularityKeyphraseInCOnf;
