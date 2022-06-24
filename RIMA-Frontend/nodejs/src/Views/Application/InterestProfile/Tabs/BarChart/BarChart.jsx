import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { CircularProgress, Grid, Typography } from "@material-ui/core";

// changed the original Class component to a functional component - Clara
const BarChart = (props) => {
  const { keywords } = props;

  const [interests, setInterests] = useState([]);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    let tempInterests = [];
    let tempWeights = [];
    keywords.forEach((keyword) => {
      tempInterests.push(keyword.text);
      tempWeights.push(keyword.value);
    });
    setInterests(tempInterests);
    setWeights(tempWeights);
  }, []);

  // The styling of the bar chart - Clara
  const options = {
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          // Can define at this point what happens when the user clicks on a bar - Alptug
        },
      },
    },
    xaxis: {
      title: { text: "Interests" },
      //what are the interests, fetched as keywords from the user model - Clara
      categories: interests,
    },
    yaxis: { title: { text: "Weight of interests" } },
  };
  // console.log(options, "test");
  const series = [
    {
      name: "Interests",
      //the value of the bars, fetched as the weights from the keywords - Clara
      data: weights,
    },
  ];
  // console.log(options, "data");
  return (
    <>
      {!interests ? (
        <>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress />
            </Grid>
            <Grid item>
              <Typography variant="overline"> Loading data </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Chart options={options} series={series} type="bar" width="700" />
        </>
      )}
    </>
  );
};

export default BarChart;
