// Hoda Start
import React, { Component } from "react";
import {
  Paper,
  CardContent,
  Grid,
  Typography,
  Box,
  makeStyles,
} from "@material-ui/core";
import Chart from "react-apexcharts";
//import ReactTags from "../../../components/react-tags/ReactTags.js";

//import "./assets/styles.css";
import Keywords from "Views/Keywords.js";

function getInterestScore(interests, max) {
  let items = [];
  if (!interests) return [{ interest: "", score: 0, color: "FFFFFF" }];
  let i = 0;
  for (let p2 in interests) {
    if (p2.toLowerCase().indexOf("data_") >= 0) {
      continue;
    }
    let value = interests[p2];
    items.push({ interest: p2, score: value.score, color: value.color });
  }
  return items
    .sort((a, b) => (a.score < b.score ? 1 : a.score == b.score ? 0 : -1))
    .filter((_, i) => i < max);
}

// Display a Barchart after clicking on a extracted keywords from abstract
function TopSimilarityChart({
  onClick,
  interests,
  height,
  width,
  maxItem,
  title,
}) {
  // title=title||"The top three similarity scores between Your Interests and this keyword";
  //title=title||;
  interests = getInterestScore(interests, maxItem || 3);
  let cats = interests.map((x) => x.interest);
  let scores = interests.map((x) => x.score);
  let colors = interests.map((x) => x.color);
  let size = { width: width, height: height || 150 };
  let options = {
    series: [{ name: "Similarity to keyword", data: scores }],
    options: {
      chart: {
        type: "bar",
        height: "100%",
      },
      // subtitle: {
      //   text: 'The top three similarity score between your interests and selected keyword',
      //   align: 'center',
      //   marginBottom:100,
      //   offsetY:0
      // },
      plotOptions: {
        bar: {
          barHeight: "80%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "right",
          },
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          fontSize: "9",
          colors: ["#000"],
        },
        formatter: function (val, opt) {
          //if( val<30) return "";
          return parseFloat(val).toFixed(2) + "%";
        },
        offsetX: 0,
      },
      colors: colors,
      /*xaxis: {title: {text: `Similarity to keyword "${keyword}"`}, categories: cats},*/
      /*xaxis: {title: {text: `"${keyword}"`}, categories: cats},*/
      xaxis: { title: { text: `Similarity score` }, categories: cats },
      yaxis: { title: { text: "User interests" }, max: 100 },
      legend: { show: false },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
          //fontSize: '10'
        },
        y: {
          //fontSize: '10',
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  };
  return (
    <Paper elevation={0} onClick={onClick}>
      <Typography variant="body2" align="left" gutterBottom>
        {title}
      </Typography>
      <Chart
        options={options.options}
        series={options.series}
        type="bar"
        {...size}
      />
    </Paper>
  );
}
export default TopSimilarityChart;
// Hoda End
