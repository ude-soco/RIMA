import React, { useEffect, useState } from "react";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";
import { useHistory } from "react-router-dom";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import {Box} from "@material-ui/core";
import BarChart from "./BarChart/BarChart";
import CirclePackingExample from "./CiclePacking/CirclePacking";




export default function InterestOverviewNew(props) {
  const history = useHistory();
  const interestsWeight = props.interestsWeights;

  console.log(interestsWeight, "test overview")
  let items = [<CloudChart />,

      <BarChart interestsWeights={interestsWeight}/>,
      <CirclePackingExample interestsWeights={interestsWeight}/>];


  return (
    <AwesomeSlider>
    {items.map((item) => {
      return <Box style={{ backgroundColor: "#fff" }}>{item}</Box>;
    })}
  </AwesomeSlider>
  );
};

