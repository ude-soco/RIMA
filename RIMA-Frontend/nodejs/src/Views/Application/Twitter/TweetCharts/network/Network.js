import { keys } from "@material-ui/core/styles/createBreakpoints";
import React, { useEffect, useState } from "react";
import RestAPI from "Services/api";
import WhatElse from "./WhatElse";
import { handleServerErrors } from "Services/utils/errorHandler";
import { toast } from 'react-toastify';
function gettingData(data) {
  const dataArray = data.map((dt) => {
    return dt.category.map((d) => [dt.keyword, d]);
  });
  let newArray = [];
  for (let dr of dataArray) {
    newArray = [...newArray, ...dr];
  }
  for (let dt of data) {
    newArray.unshift(["Interest Model", dt.keyword]);
  }
  return newArray;
}

function mapColor(data) {
  let arr = [];
  let datanew = [];
  let test = [];
  const colorArray = [
    "#434348",
    "#90ed7d",
    "#f7a35c",
    "#8085e9",
    "#f15c80",
    "#e4d354",
    "#2b908f",
    "#f45b5b",
    "#91e8e1",
  ];
  const colorArray2 = [
    "#434340",
    "#90ed70",
    "#f7a350",
    "#8085e1",
    "#f15c81",
    "#e4d351",
    "#2b9081",
    "#f45b51",
    "#91e8e1",
  ];
 
  for (var i = 0; i < data.length; i++) {
    var temp = [];
    if (keys.indexOf(data[i].keyword > -1)) {
    
      temp.push(data[i].keyword, colorArray2[i]);
    } else {
 
      temp.push(data[i].keyword, colorArray[i]);
    }
    for (let j = 0; j < data[i].category.length; j++) {
      let temp2 = [];
      temp2.push(data[i].category[j], colorArray[i]);
      arr.push(temp2);
    }
    arr.push(temp);
  }
  arr.unshift(["Interest Model", "#00ccff"]);

  var objs = arr.map(function (x) {
    if (x[0] == "Interest Model") {
      return {
        id: x[0],
        marker: {
          radius: 20,
        },
        color: x[1],
      };
    } else {
      return {
        id: x[0],
        marker: {
          radius: 10,
        },
        color: x[1],
      };
    }
  });

  return objs;
}

export default function Network(props) {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    RestAPI.conceptChart()
      .then((response) => {
        let chartData = [];
        let dataLength = Math.min(response.data.length, 5);
        for (let index = 0; index < dataLength; index++) {
          chartData.push({
            weight: response.data[index].weight,
            keyword: response.data[index].keyword,
            category: response.data[index].categories.map((item) => item.name),
          });
        }
        setData(chartData);
      })

      .catch((error) => {
        handleServerErrors(error, toast.error);
      });
    setKeys(props.name.map((key) => key.text));
  }, [props]);

  function mapColor(data) {
    let arr = [];
    console.log("Map color is rendering");
    const colorArray = [
      "#434348",
      "#90ed7d",
      "#f7a35c",
      "#8085e9",
      "#f15c80",
      "#e4d354",
      "#2b908f",
      "#f45b5b",
      "#91e8e1",
    ];
    const colorArray2 = [
      "#84848a",
      "#c6f5bc",
      "#f7cba6",
      "#bfc2f2",
      "#edabbb",
      "#faf2b4",
      "#a2e0e0",
      "#eda4a4",
      "#d5f2f0",
    ];

    for (var i = 0; i < data.length; i++) {
      var temp = [];
      if (keys.indexOf(data[i].keyword) > -1) {
        temp.push(data[i].keyword, colorArray2[i], data[i].weight * 5);
      } else {
        temp.push(data[i].keyword, colorArray[i], data[i].weight * 5);
      }

      for (let j = 0; j < data[i].category.length; j++) {
        let temp2 = [];
        if (keys.indexOf(data[i].category[j]) > -1) {
          temp2.push(data[i].category[j], colorArray2[i], 10);
        } else {
          temp2.push(data[i].category[j], colorArray[i], 10);
        }

        arr.push(temp2);
      }
      arr.push(temp);
    }
    arr.unshift(["Interest Model", "#00ccff"]);

    var objs = arr.map(function (x) {
      if (x[0] == "Interest Model") {
        return {
          id: x[0],
          marker: {
            radius: 30,
          },
          color: x[1],
        };
      } else {
        return {
          id: x[0],
          marker: {
            radius: x[2],
          },
          color: x[1],
        };
      }
    });

    return objs;
  }

  return (
    <>
      <h4>
        This Network graph illustrate the other keywords which might be
        interesting to you and help you to get more tweet recommendation related
        to one specific category. Click on each of potential interests to add it
        to your search bar
      </h4>
      <WhatElse
        handleAddition={props.handleAddition}
        data={gettingData(data)}
        classes={props.classes}
        color={mapColor(data)}
        keys={keys}
        mapColor={mapColor}
      />
    </>
  );
}
