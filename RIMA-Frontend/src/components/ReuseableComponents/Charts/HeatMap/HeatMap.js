import React from "react";
import ReactApexChart from "react-apexcharts"

export default function HeatMap(props) {
  const {series} = props;
  const options = {
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB"],
   }

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type='heatmap'
        width='550'
        height='280'
      />
    </>
  )
}
