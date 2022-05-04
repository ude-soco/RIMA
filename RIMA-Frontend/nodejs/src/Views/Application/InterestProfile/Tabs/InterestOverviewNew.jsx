import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";
import { useHistory } from "react-router-dom";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import {Box} from "@material-ui/core";
import BarChart from "./BarChart/BarChart";
import CirclePackingExample from "./CiclePacking/CirclePacking";



export default function InterestOverviewNew({ classes }) {
  const history = useHistory();
  let items = [<CloudChart/>, <BarChart/>, <CirclePackingExample/>];


  return (
    <AwesomeSlider>
    {items.map((item) => {
      return <Box style={{ backgroundColor: "#fff" }}>{item}</Box>;
    })}
  </AwesomeSlider>
  );
};

