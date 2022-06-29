import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  Popover
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";
import WhyInterest from "../../WhyInterest/WhyInterest";


// changed the original Class component to a functional component - Clara
const BarChart = (props) => {
  const { keywords, handleClickPopOver, id, setCurrInterest} = props;

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
          /*console.log(config, "test barchart", options.xaxis.categories[config.dataPointIndex],
              options.xaxis.categories,config.dataPointIndex);*/
         // popUp()
          handleClickPopOver(event)
          setCurrInterest(options.xaxis.categories[config.dataPointIndex])



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
          <Chart options={options} series={series} type="bar" width="700" aria-describedby={id}  />
        </>
      )}


    </>
  );
};

export default BarChart;
