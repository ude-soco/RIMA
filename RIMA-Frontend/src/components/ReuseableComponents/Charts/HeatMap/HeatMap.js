import React from "react";
import ReactApexChart from "react-apexcharts"

// Refer to the documentation: https://apexcharts.com/docs/chart-types/heatmap-chart/
// Attention to the data format of "series" when passing as props

export default function HeatMap(props) {
  const {series, width, height} = props;
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
        width={width}
        height={height}
      />
    </>
  )
}
