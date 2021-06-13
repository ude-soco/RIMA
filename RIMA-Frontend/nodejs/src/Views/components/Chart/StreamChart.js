import React from "react";
import Chart from "react-apexcharts";
import {toast} from "react-toastify";
import RestAPI from "Services/api";

import {handleServerErrors} from "Services/utils/errorHandler";
import {Card, CardContent, CircularProgress, Grid, Tooltip, Typography} from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';

class StreamChart extends React.Component {
  state = {
    chartOptions: {
      twitterXaxis: {},
      paperXaxis: {},
      twitterSeries: [],
      paperSeries: [],
    },
    isLoading: true,
  };

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

  componentDidMount() {
    this.setState({isLoading: true}, () => {
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

          this.setState({chartOptions, isLoading: false});
        })
        .catch((error) => {
          this.setState({isLoading: false});
          handleServerErrors(error, toast.error);
        });
    });
  }

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
        <Grid item lg={12}>
          <Card className={this.props.classes.spacing}>
            <CardContent>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="h5" gutterBottom> Potential Interest: Paper Keywords Trend </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title={
                    <Typography gutterBottom>
                      These charts allow you to monitor your interests over the last
                      years. The x-axis represents the years, and the y-axis represents the importance of the interest (the
                      larger the area the greater the interest).
                    </Typography>
                  } arrow style={{cursor: "pointer"}}>
                    <HelpIcon color="disabled"/>
                  </Tooltip>
                </Grid>
              </Grid>
              {this.state.isLoading ?
                <CircularProgress/> :
                <Grid item xs={12}>
                  <Chart
                    type="area"
                    series={this.state.chartOptions.paperSeries}
                    options={paperGraphOptions}
                    height={400}
                    // width={900}
                  />
                </Grid>
              }
              <p className="h1-s rtl">Quantity</p>
              <p className="h1-s">Year</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item lg={12}>
          <Card className={this.props.classes.cardHeight}>
            <CardContent>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="h5" gutterBottom> Potential Interest: Twitter Keywords Trend </Typography>
                </Grid>
                <Grid item>
                  <Tooltip title={
                    <Typography gutterBottom>
                      These charts allow you to monitor your interests over the last
                      years. The x-axis represents the years, and the y-axis represents the importance of the interest (the
                      larger the area the greater the interest).
                    </Typography>
                  } arrow style={{cursor: "pointer"}}>
                    <HelpIcon color="disabled"/>
                  </Tooltip>
                </Grid>
              </Grid>
              {this.state.isLoading ?
                <CircularProgress/> :
                <Grid item>
                  <Chart
                    type="area"
                    series={this.state.chartOptions.twitterSeries}
                    options={twitterGraphOptions}
                    height={400}
                    // width={900}
                  />
                </Grid>
              }
            </CardContent>
          </Card>
        </Grid>
        {/*<div align="center">Paper Keyword Trends</div>*/}
        {/*<div align="center" id="chart">*/}
        {/*  <Chart*/}
        {/*    type="area"*/}
        {/*    series={this.state.chartOptions.paperSeries}*/}
        {/*    options={paperGraphOptions}*/}
        {/*    height={300}*/}
        {/*    width={900}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<br /> <br />*/}
        {/*<div align="center">Twitter Keyword Trends</div>*/}
        {/*<div align="center" id="chart">*/}
        {/*  <Chart*/}
        {/*    type="area"*/}
        {/*    series={this.state.chartOptions.twitterSeries}*/}
        {/*    options={twitterGraphOptions}*/}
        {/*    height={300}*/}
        {/*    width={900}*/}
        {/*  />*/}
        {/*</div>*/}
      </>

    );
  }
}

export default StreamChart;
