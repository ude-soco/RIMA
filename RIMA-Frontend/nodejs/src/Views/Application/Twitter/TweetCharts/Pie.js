import { Pie } from "react-chartjs-2";
import React, { useState } from "react";

export default function PieChartComponent(props) {
  //const [tags,]
  const ArrColor = [];
  let labels = [];
  console.log(props.interest.sort(), "props interest");
  let prc = [];

  const ordered = Object.keys(props.percentage).reduce(
    (prev, current) => ({
      ...prev,
      [current.toLowerCase()]: props.percentage[current],
    }),
    {}
  );

  let lastOrdered = Object.keys(ordered)

    .sort()
    .reduce((obj, key) => {
      obj[key] = ordered[key];
      return obj;
    }, {});

  for (let data in lastOrdered) {
    prc.push(lastOrdered[data].toFixed(2));
  }

  const sorted = props.interest.sort(function (first_el, second_el) {
    // selecting key to sort
    let fname = first_el.text;
    let sname = second_el.text;

    if (fname.localeCompare(sname) < 0) return -1;
    else if (fname.localeCompare(sname) > 0) return 1;
    else if (fname.localeCompare(sname) == 0) return 0;
  });

  console.log(prc, "prc");
  for (let tag of props.interest) {
    labels.push(tag.text);
  }
  const result = Object.keys(ordered);
  const result1 = result.map((v) => v.toLowerCase()).sort();
  let colors = [];

  let temp = [];
  for (let i of sorted) {
    if (result1.indexOf(i.text.toLowerCase()) > -1) {
      temp.push(i.color);
    }
  }

  for (let color of props.interest) {
    colors.push(color.color);
  }

  let datasets = [
    {
      data: prc,
      backgroundColor: temp,
    },
  ];

  return (
    <Pie
      data={{
        labels: result1,
        datasets: datasets,
      }}
    />
  );
}
