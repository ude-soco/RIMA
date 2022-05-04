import React, { useEffect, useState, Component } from "react";
import Chart from "react-apexcharts";
import { handleServerErrors } from "Services/utils/errorHandler";
import { Grid, Typography } from "@material-ui/core";
import { getColorArray } from "Services/utils/functions";

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              // Can define at this point what happens when the user clicks on a bar - Alptug
            }
          }
        },
        xaxis: {
          title: { text: "Interests" }, 
          categories: [
            "Learning",
            "Explanation",
            "Visualization",
            "Recommender System",
            "Peer Assessment",
            "Big Data",
            "Social Media"
          ]
        },
        yaxis: { title: { text: "Weight of interests" } },
      },

      series: [
        {
          name: "Interests",
          data: [5, 5, 4, 3, 3, 2, 2]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BarChart;





