import React, {useEffect, useState} from "react";
import RestAPI from "../../../../Services/api";
import {handleServerErrors} from "../../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import {Card, CardContent, CircularProgress, Grid, Typography} from "@material-ui/core";
import Chart from "react-apexcharts";
import {getColorArray} from "../../../../Services/utils/functions";

const option = {
  chart: {
    type: "area",
    stacked: true,
  },
  colors: [],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth"
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.2,
      opacityTo: 0.8
    }
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center"
  },
}


export default function InterestTrends({classes, elevation, show, user}) {
  const [paper, setPaper] = useState({
    series: [],
    options: {
      ...option,
      xaxis: {title: {text: "Year"}, categories: {}},
      yaxis: {title: {text: "Weight"}}
    }
  });
  const [tweets, setTweets] = useState({
    series: [],
    options: {
      ...option,
      xaxis: {title: {text: "Month"}, categories: {}},
      yaxis: {title: {text: "Weight"}}
    }
  });

  const getChartOptions = (data) => {
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
    return {xAxis: xAxisOptions, series: seriesData};
  };

  useEffect(() => {
    RestAPI.interestTrends(user)
      .then((response) => {
        const {twitter_data, paper_data} = response.data;
        let twitterData = getChartOptions(twitter_data);
        let paperData = getChartOptions(paper_data);

        setPaper({
          ...paper,
          series: paperData.series,
          options: {
            ...paper.options,
            colors: getColorArray(paperData.series.length),
            xaxis: {
              ...paper.options.xaxis,
              categories: paperData.xAxis
            }
          }
        });
        setTweets({
          ...tweets,
          series: twitterData.series,
          options: {
            ...tweets.options,
            colors: getColorArray(twitterData.series.length),
            xaxis: {
              ...tweets.options.xaxis,
              categories: twitterData.xAxis
            }
          }
        });
      })
      .catch((error) => {
        handleServerErrors(error, toast.error);
      });
  }, [])


  return (
    <>
      <Grid item xs={12}>
        <Card className={classes.cardHeight} elevation={elevation ? 1 : 0}>
          <CardContent>
            {show ?
              <>
                <Typography variant="h5" gutterBottom> Evolution of Interests: Publications </Typography>
                <Typography gutterBottom> Interest trends of paper keywords over the last five years </Typography>
              </>
              : <>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  Interest trends of paper keywords over the last five years
                </Typography>
              </>
            }

            {paper.series.length ?
              <>
                <Grid item xs={12}>
                  <Chart
                    type="area"
                    series={paper.series}
                    options={paper.options}
                    height={400}
                    // width={900}
                  />
                </Grid>
              </> :
              <CircularProgress/>
            }
          </CardContent>
        </Card>
      </Grid>

      {tweets.series.length ? <Grid item xs={12}>
        <Card className={classes.cardHeight} elevation={elevation ? 1 : 0}>
          <CardContent>
            {show ?
              <>
                <Typography variant="h5" gutterBottom> Evolution of Interests: Tweets </Typography>
                <Typography gutterBottom> Interest trends of twitter keywords over the last 6 months </Typography>
              </> :
              <>
                <Typography gutterBottom variant="h6" color="textSecondary">
                  Interest trends of twitter keywords over the last 6 months
                </Typography>
              </>
            }

            {tweets.series.length ?
              <>
                <Grid item>
                  <Chart
                    type="area"
                    series={tweets.series}
                    options={tweets.options}
                    height={400}
                    // width={900}
                  />
                </Grid>
              </> :
              <CircularProgress/>
            }
          </CardContent>
        </Card>
      </Grid> : <></>}

    </>
  );
}
