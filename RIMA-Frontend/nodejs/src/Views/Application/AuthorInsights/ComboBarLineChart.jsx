import { Grid, Paper } from "@mui/material";
import { BASE_URL_CONFERENCE } from "Services/constants";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";

const ChartComponent = ({ AuthorName }) => {
  const [loader, setLoader] = useState(false);
  const [series, setSeries] = useState([
    {
      name: "Publications",
      type: "column",
      data: [10, 15, 7, 14],
    },
    {
      name: "Citations",
      type: "line",
      data: [30, 20, 50, 40],
    },
  ]);

  const [options, setOption] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "Publications and Citations",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: ["2018", "2019", "2020", "2021"],
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        title: {
          text: "Publications",
        },
      },
      {
        opposite: true,
        title: {
          text: "Citations",
        },
      },
    ],
  });

  useEffect(() => {
    getAuthorPublicationCitation();
  }, []);
  useEffect(() => {
    getAuthorPublicationCitation();
  }, [AuthorName]);
  const getAuthorPublicationCitation = async () => {
    setLoader(true);

    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorPublicationsCitations/" + AuthorName.label
    );
    const respone = await request.json();

    setSeries(respone.series);
    setOption({
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Publications and Citations",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: respone.categories,
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Publications",
          },
        },
        {
          opposite: true,
          title: {
            text: "Citations",
          },
        },
      ],
    });
    setLoader(false);
  };

  return (
    <Grid container xs={12} style={{ padding: "2%", marginTop: "2%" }}>
      <Paper sx={{ margin: "20px", width: "100%", padding: "1%" }}>
        <Grid item xs={12}>
          <div id="chart">
            <ActiveLoader height={50} width={50} visible={loader} />
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={400}
            />
          </div>
        </Grid>{" "}
      </Paper>
    </Grid>
  );
};

export default ChartComponent;
