import React from "react";
import {Line} from "react-chartjs-2";

export default function LineChartDummy() {
  const chartData = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
      "Week 7",
      "Week 8",
      "Week 9",
      "Week 10",
    ],
    datasets: [
      {
        label: "Media library",
        data: [200, 170, 160, 150, 130, 120, 160, 180, 130, 90],
        backgroundColor: "rgba(212, 236, 212, 1)",
        borderColor: "rgba(44, 160, 44, 1)",
      },
      {
        label: "Hyperlinks",
        data: [2000, 1700, 1500, 1200, 1400, 800, 600, 300, 1500, 2200 ],
        backgroundColor: "rgba(255, 229, 206, 1)",
        borderColor: "rgba(225, 129, 17, 1)",
      },
      {
        label: "Learning materials",
        data: [4000, 3700, 1500, 2500, 2200, 2000, 1700, 1500, 700, 2000],
        backgroundColor: "rgba(210, 228, 240, 1)",
        borderColor: "rgba(32, 120, 180, 1)",
      },
    ]
  };

  return (
    <>
      <Line
        data={chartData}
        width={610}
        height={300}
        options={{
          maintainAspectRatio: true,
          legend: { display: true, position: "bottom" },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
    </>
  );
}
