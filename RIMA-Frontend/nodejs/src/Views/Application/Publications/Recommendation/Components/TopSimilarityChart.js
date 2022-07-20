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

//import "./assets/styles.css";
import Keywords from "Views/Keywords.js";

/**
 * Convert an object of interests to a sorted list of interests
 * @param {object} interests Object of interests
 * @param {number} max Maximum interets can be returned
 * @returns a sorted list of interests{interest,score,color}
 */
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

/**
 * Display a Barchart to show the list of the user interets
 * @param {object} props Component props
 * @param {object} props.interests Interests object of keyword
 * @param {number} props.height Height of the Bar chart
 * @param {number} props.width Width of the Bar chart
 * @param {number} props.maxItem Maximum bar can be shown in the Bar chart
 * @param {string} props.title Titel of the Bar chart
 * @param {boolean} props.onClick When the user click on the chart, this function will be called
 */
function TopSimilarityChart({
  interests,
  height,
  width,
  maxItem,
  title,
  onClick,
}) {
  interests = getInterestScore(interests, maxItem || 3);
  let cats = interests.map((x) => x.interest);
  let scores = interests.map((x) => parseFloat(x.score).toFixed(2));
  let colors = interests.map((x) => x.color);
  let size = { width: width, height: height || 150 };
  let options = {
    series: [{ name: "Similarity to keyword", data: scores }],
    options: {
      chart: {
        type: "bar",
        height: "100%",
      },
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
          return parseFloat(val).toFixed(2) + "%";
        },
        offsetX: 0,
      },
      colors: colors,
      xaxis: { title: { text: `Similarity score` }, categories: cats },
      yaxis: { title: { text: "User interests" }, max: 100 },
      legend: { show: false },
      tooltip: {
        theme: "dark",
        show: false,
        x: {
          show: false,
        },
        y: {
          show: false,
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
