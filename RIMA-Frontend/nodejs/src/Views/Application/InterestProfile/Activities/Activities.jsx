import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {toast} from "react-toastify";
import RestAPI from "Services/api";

import {handleServerErrors} from "Services/utils/errorHandler";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import {getColorArray} from "../../../../Services/utils/functions";

const height = 400

export default function Activities({classes, loading, user, elevation, showTitle, vertical}) {
  const [publications, setPublications] = useState({
    series: [],
    options: {
      dataLabels: {enabled: true},
      colors: getColorArray(1),
      xaxis: {title: {text: "Year"}, categories: []},
      yaxis: {title: {text: "Number of papers"}}
    }
  });
  const [tweets, setTweets] = useState({
    series: [],
    options: {
      dataLabels: {enabled: true},
      colors: getColorArray(1),
      xaxis: {title: {text: "Month"}, categories: []},
      yaxis: {title: {text: "Number of tweets"}}
    }
  });

  useEffect(() => {
    if (!publications.series.length) {
      RestAPI.activities(user)
        .then((response) => {
          let paperList = Object.keys(response.data.papers);
          let paperValues = Object.values(response.data.papers);
          let tweetList = Object.keys(response.data.tweets);
          let tweetValues = Object.values(response.data.tweets);
          setPublications({
            ...publications,
            series: [{name: "Number of papers", data: [...paperValues]}],
            options: {
              ...publications.options,
              xaxis: {...publications.options.xaxis, categories: [...paperList]},
            }
          });
          setTweets({
            ...tweets,
            series: [{name: "Number of tweets", data: [...tweetValues]}],
            options: {
              ...tweets.options,
              xaxis: {...tweets.options.xaxis, categories: [...tweetList]},
            }
          })

        })
        .catch((error) => {
          handleServerErrors(error, toast.error);
        });
    }

  }, [publications, tweets]);

  return (
    <>
      <Card className={classes.cardHeight} elevation={elevation ? 1 : 0}>
        <CardContent>
          {showTitle ? <Typography variant="h5" gutterBottom> Activities: Publications and Tweets </Typography> : <></>}
          <Grid container direction={vertical ? "column" : "row"} spacing={2}>
            <Grid item xs={12} lg={vertical ? 12 : 6}>
              <Typography gutterBottom> The number of publications published in the last 5 years </Typography>
              {publications.series.length ?
                <Grid item xs={12}>
                  <Chart options={publications.options} series={publications.series} type="bar" height={height}/>
                </Grid> :
                <> {loading} </>
              }
            </Grid>

            <Grid item xs={12} lg={vertical ? 12 : 6}>
              <Typography gutterBottom> The number of tweets in the last 6 months.</Typography>
              {tweets.series.length ?
                <Grid item>
                  <Chart options={tweets.options} series={tweets.series} type="bar" height={height}/>
                </Grid> :
                <> {loading} </>
                }
              </Grid>
            </Grid>

          </CardContent>
        </Card>
    </>
  );
}
