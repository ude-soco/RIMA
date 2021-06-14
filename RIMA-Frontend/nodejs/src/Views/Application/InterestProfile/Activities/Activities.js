import React, {Component} from "react";
import Chart from "react-apexcharts";
import {toast} from "react-toastify";
import RestAPI from "Services/api";

import {handleServerErrors} from "Services/utils/errorHandler";
import {Card, CardContent, CircularProgress, Grid, Typography} from "@material-ui/core";

export default class Activities extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
        },
        fill: {
          colors: ["#9C27B0"],
        },
        xaxis: {
          categories: [],
        },
      },
      series: [],
      tweetoptions: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [],
        },
      },
      tweetseries: [],
    };
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      RestAPI.barChart()
        .then((response) => {
          let categorieList = Object.keys(response.data.papers);
          let value = Object.values(response.data.papers);
          let tweetscategorieList = Object.keys(response.data.tweets);
          let tweetsvalue = Object.values(response.data.tweets);
          console.log(response.data.tweets);
          this.setState({
            isLoading: false,
            data: response.data,
            series: [{name: "Paper", data: [...value]}],
            tweetseries: [{name: "Tweet", data: [...tweetsvalue]}],
            // options: { ...this.state.options, ...this.state.options.xaxis, ...this.state.options.xaxis.categories = categorieList },
            // tweetoptions: { ...this.state.tweetoptions, ...this.state.tweetoptions.xaxis, ...this.state.tweetoptions.xaxis.categories = tweetscategorieList },
            options: {
              chart: {
                id: "basic-bar",
              },

              fill: {
                colors: ["#9C27B0"],
              },
              xaxis: {
                categories: [...categorieList],
              },
            },
            tweetoptions: {
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories: [...tweetscategorieList],
              },
            },
          });
        })
        .catch((error) => {
          this.setState({isLoading: false});
          handleServerErrors(error, toast.error);
        });
    });
  }

  render() {
    return (

      <>
        <Grid item lg={4}>
          <Card className={this.props.classes.cardHeight}>
            <CardContent>
              <Typography variant="h5" gutterBottom> Activities: Publications </Typography>
              <Typography gutterBottom> The number of publications published in the last 5 years </Typography>
              {this.state.isLoading ?
                <CircularProgress/> :
                <Grid item xs={12}>
                  <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="bar"
                    // width="600"
                  />
                </Grid>
              }
              <p className="h1-s rtl">Quantity</p>
              <p className="h1-s">Year</p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item lg={4}>
          <Card className={this.props.classes.cardHeight}>
            <CardContent>
              <Typography variant="h5" gutterBottom> Activities: Twitter </Typography>
              <Typography gutterBottom> The number of tweets in the last 6 months.</Typography>
              {this.state.isLoading ?
                <CircularProgress/> :
                <Grid item>
                  <Chart
                    options={this.state.tweetoptions}
                    series={this.state.tweetseries}
                    type="bar"
                    // width="600"
                  />
                </Grid>
              }
            </CardContent>
          </Card>
        </Grid>
      </>
    );
  }
}
