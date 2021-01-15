import React from "react";
import ReactApexChart from "react-apexcharts"

export default function HeatMapTweet(props) {
  const {series} = props;
  console.log(series[0].data);
    /* const series = [
    {
      name: "Berlin",
      data: [
        { x: "people", y: 20 },
        { x: "adult", y: 30 },
      ],
    },
    {
      name: "New york",
      data: [
        { x: "people", y: 20 },
        { x: "adult", y: 80 },
      ],
    },
  ];
 */
  const options = {
      chart: {
        height: 350,
        type: "heatmap",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#008FFB"],
      title: {
        text: "HeatMap Chart (Single color)",
      },
    }

    return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height={350}
      />
    </div>
  )
}
