import React, { useEffect, useState, Component } from "react";
import Chart from "react-apexcharts";
import { handleServerErrors } from "Services/utils/errorHandler";
import { Grid, Typography } from "@material-ui/core";
import { getColorArray } from "Services/utils/functions";
import RestAPI from "../../../../../Services/api";

// changed the original Class component to a functional component - Clara
const BarChart = (props) => {
    // the weights & interest are passed down as props from the parent component => only fetching them once for
    // all visualizations on my interest page - Clara
    const interestsWeights = props.interestsWeights
    const interests = Object.keys(interestsWeights)
    let weights = []
    interests.map((interest) =>
    weights.push(interestsWeights[interest]["weight"]))

    // The styling of the bar chart - Clara
  const options=
      {chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              // Can define at this point what happens when the user clicks on a bar - Alptug
            }
          }
        },
        xaxis: {
          title: { text: "Interests" },
            //what are the interests, fetched as keywords from the user model - Clara
          categories: interests,
        },
        yaxis: { title: { text: "Weight of interests" } },
      };
  console.log(options, "test")
  const series = [
      {
        name: "Interests",
          //the value of the bars, fetched as the weights from the keywords - Clara
        data: weights,
      }
    ];
  console.log(options, "data")
  return(

      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
                options={options}
                series={series}
                type="bar"
                width="500"
            />
          </div>
        </div>
      </div>
  )
}


export default BarChart;





