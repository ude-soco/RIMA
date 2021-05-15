import React, { Component } from "react";
import { toast } from "react-toastify";
import { handleServerErrors } from "Services/utils/errorHandler";
import RestAPI from "../../../Services/api";
import Chart from "react-apexcharts";
import "d3-transition";
import "react-tabs/style/react-tabs.css";

class PaperCharts extends Component {
  state = {
    chartOptions: {
      twitterXaxis: {},
      paperXaxis: {},
      twitterSeries: [],
      paperSeries: [],
    },
    isLoding: true,
  };

  componentDidMount() {
    this.setState({ isLoding: true }, () => {
      RestAPI.streamChart()
        .then((response) => {
          let twitterData = this.getChartOptions(response.data.twitter_data);
          let paperData = this.getChartOptions(response.data.paper_data);

          let chartOptions = {
            twitterXaxis: twitterData.xAxis,
            twitterSeries: twitterData.series,
            paperXaxis: paperData.xAxis,
            paperSeries: paperData.series,
          };

          this.setState({ chartOptions, isLoding: false });
        })
        .catch((error) => {
          this.setState({ isLoding: false });
          handleServerErrors(error, toast.error);
        });
    });
  }

  getChartOptions = (data) => {
    let chartOptions = {};

    let xAxisOptions = Object.keys(data);
    let seriesData = [];
    let keywords = {};

    let keywordDataOverTime = Object.values(data);
    for (let index = 0; index < keywordDataOverTime.length; index++) {
      for (
        let itemIndex = 0;
        itemIndex < keywordDataOverTime[index].length;
        itemIndex++
      )
        keywords[keywordDataOverTime[index][itemIndex]["keyword__name"]] = true;
    }

    for (let keywordName of Object.keys(keywords)) {
      let monthRank = [];
      for (let index = 0; index < xAxisOptions.length; index++) {
        let searchedList = data[xAxisOptions[index]].filter(
          (item) => item["keyword__name"] === keywordName
        );
        monthRank.push(searchedList.length ? searchedList[0].weight : 0);
      }
      seriesData.push({
        name: keywordName,
        data: monthRank,
      });
    }
    return { xAxis: xAxisOptions, series: seriesData };
  };

  render() {
    let graphOptions = {
      chart: {
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: false,
            selection: true,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: false,
            customIcons: [],
          },
          autoSelected: "zoom",
        },

        type: "area",
        stacked: true,
      },
      colors: [
        "#7CB5EC",
        "#616369",
        "#A0E094",
        "#F7A35C",
        "#8A8EEA",
        "#F98CA7",
        "#E6D662",
        "#2B908F",
        "#F56464",
        "#86C79A",
      ],
      dataLabels: { enabled: false },
      stroke: {
        curve: "smooth",
        width: 1,
      },
      fill: { type: "solid" },
      xaxis: {},
    };
    let twitterGraphOptions = JSON.parse(JSON.stringify(graphOptions));
    twitterGraphOptions.xaxis.categories = this.state.chartOptions.twitterXaxis;

    let paperGraphOptions = JSON.parse(JSON.stringify(graphOptions));
    paperGraphOptions.xaxis.categories = this.state.chartOptions.paperXaxis;

    return (
      <>
        <div style={{ width: "450px", margin: "0 auto" }}>
          <div align="center">Paper Keyword Trends</div>
          <div id="chart">
            <Chart
              type="area"
              series={this.state.chartOptions.paperSeries}
              options={paperGraphOptions}
              width="400"
            />
          </div>
        </div>
      </>
    );
  }
}

export default PaperCharts;
