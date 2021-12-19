import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import TrackFalseSlider from "./MultiRangeSlider";
// Refer to the documentation: https://apexcharts.com/docs/chart-types/heatmap-chart/
// Attention to the data format of "series" when passing as props

export default function HeatMap(props) {
  const { series, width, height } = props;
  const [similar, setSimilar] = useState({ from: 1, to: 50 });
  const [slightlySimilar, setSlightlySimilar] = useState({ from: 0, to: 1 });
  const [verySimilar, setverySimilar] = useState({ from: 50, to: 100 });
  const options = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
    },
    plotOptions: {
      heatmap: {
        radius: 5,
        enableShades: false,
        //shadeIntensity: 0.5,

        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            {
              from: similar.from,
              to: similar.to,
              name: "similar",
              color: "#2f9beb",
            },
            {
              from: verySimilar.from,
              to: verySimilar.to,
              name: "very similar",
              color: "#08cf2d",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#d5dde3"],
  };

  return (
    <>
      <TrackFalseSlider
        setverySimilar={setverySimilar}
        setSimilar={setSimilar}
        setSlightlySimilar={setSlightlySimilar}
        similar={similar}
        slightlySimilar={slightlySimilar}
        verySimilar={verySimilar}
      />
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        width={width}
        height={height}
      />
    </>
  );
}
