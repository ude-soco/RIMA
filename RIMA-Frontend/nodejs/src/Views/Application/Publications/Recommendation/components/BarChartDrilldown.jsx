/**
 * BarChartDrilldown.jsx - Clickable bar chart for what-if general explanation
 * First group of bar chart depict the publications' similarity score
 * User can click on bars to see the relevancy scores between the paper and interests
 * contains:
 * 1. Drilldown barchart
 * (https://www.highcharts.com/demo/column-drilldown)
 */
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Grid } from "@material-ui/core";

drilldown(Highcharts);
/**
 * @function BarChart
 * Clickable bar chart for what-if general explanation
 * @param {Object} props threshold(Number), items(Object - recommended publications), drilldown(Object - relevancy scores)
 * @returns Drilldown Barchart
 */
export const BarChart = (props) => {
  const { threshold, items, drilldownData } = props;

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Possible Similarities",
    },
    subtitle: {
      text: "Click the columns to view interests similarities.",
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: "category",
      labels: {
        rotation: -45,
        style: {
          fontFamily: "Verdana, sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: "Similarity Scores",
      },
      plotLines: [
        {
          color: "black",
          dashStyle: "dash",
          width: 2,
          value: threshold,
          label: {
            align: "left",
            style: {
              fontStyle: "italic",
            },
            text: "Similarity Threshold",
            x: -10,
          },
          zIndex: 13,
        },
      ],
    },

    plotOptions: {
      column: {
        grouping: false,
        pointWidth: 15,
      },
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">Similarity Scores</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>',
    },

    series: [
      {
        name: "Already recommended",
        colorByPoint: false,
        data: items.old.data || [],
      },
      {
        name: "New recommendations",
        color: "green",
        data: items.new.data || [],
      },
      {
        name: "Out of recommendation",
        color: "red",
        data: items.out.data || [],
      },
    ],

    drilldown: {
      breadcrumbs: {
        buttonTheme: {
          fill: "#f7f7f7",
          padding: 8,
          stroke: "#cccccc",
          "stroke-width": 1,
        },
        floating: true,
        position: {
          align: "left",
        },
        showFullPath: false,
      },
      series: drilldownData,
    },
  };

  return (
    <Grid>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        style={{ height: "800px" }}
      />
    </Grid>
  );
};
