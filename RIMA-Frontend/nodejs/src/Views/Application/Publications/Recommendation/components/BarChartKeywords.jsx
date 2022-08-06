/**
 * BarChartKeywords.jsx - Simple barchart and compareable barchart for what-if keyword explanation
 * gray bar shows the similarity before applying the changes
 * Green bar for similarity score means the publication will be recommended
 * red one says the publication will not be recommended after applying
 * contains:
 * 1. simple bar chart
 * 2. compareble bar chart for similarity score
 */
import React from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import drilldown from "highcharts/modules/drilldown";
import { Grid } from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";

drilldown(Highcharts);
/**
 * @function Barchart
 * Simple barchart and compareable barchart for what-if keyword explanation
 * @param {Object} props paper(Object), threshold(Number)
 * @returns A Simple barchart and a compareable barchart
 */
export const BarChart = (props) => {
  if (!props.paper.keywords_relevancy) {
    return null;
  }

  const { paper, threshold } = props;
  const keywords_relevancy = Object.entries(paper.keywords_relevancy).map(
    (data) => Object.assign({ name: data[0], y: data[1] })
  );

  const { score, new_score } = paper;
  const scoreColor = new_score > threshold ? "green" : "red";
  const status = new_score > threshold ? "Recommended" : "Not Recommended";

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "The relevance of the paper keywords to your interests model",
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Relevance Scores",
      },
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
        color: blueGrey[500],
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">Similarity Scores</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>',
    },

    series: [
      {
        data: keywords_relevancy || [],
      },
    ],
  };
  const scoreOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: "Compare Similarity Score",
      align: "center",
      style: {
        fontSize: "14px",
      },
    },
    subtitle: {
      text: `The paper will be ${status}`,
      align: "center",
      style: {
        color: scoreColor,
        fontWeight: "bold",
      },
    },
    plotOptions: {
      column: {
        pointWidth: 20,
      },
      series: {
        grouping: false,
        borderWidth: 0,
        style: { margin: "20px" },
      },
      softThreshold: true,
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      shared: true,
      headerFormat:
        '<span style="font-size: 15px">{point.point.name}</span><br/>',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} %</b><br/>',
    },
    xAxis: {
      type: "category",
      title: {
        text: "Current Paper",
        style: { fontWeight: "bold" },
      },
    },
    yAxis: [
      {
        showFirstLabel: false,
        title: {
          text: "Similarity Score",
          style: {
            fontWeight: "bold",
          },
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
              text: "Threshold",
              x: -10,
            },
            zIndex: 8,
          },
        ],
      },
    ],
    series: [
      {
        color: "rgb(158, 159, 163)",
        pointPlacement: -0.05,
        data: [["", score]],
        name: "Before changing",
      },
      {
        name: "After changing",
        color: scoreColor,
        dataLabels: [
          {
            enabled: true,
            inside: true,
            style: {
              fontSize: "16px",
            },
          },
        ],
        data: [["", new_score]],
      },
    ],
  };
  return (
    <Grid item container spacing={8} style={{ paddingTop: "30px" }}>
      <Grid item md={8}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Grid>
      <Grid item md={4}>
        <HighchartsReact highcharts={Highcharts} options={scoreOptions} />
      </Grid>
    </Grid>
  );
};
