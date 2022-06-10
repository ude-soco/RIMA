import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";
import { useHistory } from "react-router-dom";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import {Box} from "@material-ui/core";
import BarChart from "./BarChart/BarChart";
import CirclePackingExample from "./CiclePacking/CirclePacking";
import RestAPI from "../../../../Services/api";



export default function InterestOverviewNew({ classes }) {
  const history = useHistory();
  //Start Clara
  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
  const [interests, setInterests] = React.useState(null);
  const [weights, setWeights] = React.useState(null);

  React.useEffect(() => {
    RestAPI.longTermInterest(currentUser)
        .then((response) => {
          console.log(response.data, "data")
          let interestsArray=[];
          let weightsArray = [];
          for (let i = 0; i < response.data.length; i++){
            interestsArray.push(response.data[i].keyword)
            weightsArray.push(response.data[i].weight)
          };

          //console.log(interestsArray, weightsArray, "test");

          setInterests(interestsArray);
          setWeights(weightsArray);
        });
  }, []);
  //End Clara
  let items = [<CloudChart/>,
      <BarChart interests={interests} weights={weights}/>,
      <CirclePackingExample interests={interests} weights={weights}/>];


  return (
    <AwesomeSlider>
    {items.map((item) => {
      return <Box style={{ backgroundColor: "#fff" }}>{item}</Box>;
    })}
  </AwesomeSlider>
  );
};

