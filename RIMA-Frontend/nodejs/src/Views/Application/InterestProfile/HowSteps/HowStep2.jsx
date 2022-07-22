import React, {useEffect, useState} from "react";
import {Grid, Typography,} from "@material-ui/core";
import Chart from "react-apexcharts";
import {getColorArray} from "../../../../Services/utils/functions";
import RestAPI from "../../../../Services/api";
import {handleServerErrors} from "../../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import {Loading} from "../Tabs/MyInterests";

const HowStep2 = () => {
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
      RestAPI.activities()
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
    <Grid container>
      <Grid item xs={12} style={{paddingBottom: 16}}>
        <Typography variant="h5">
          Collect publications and tweets
        </Typography>
      </Grid>

      <Grid container>
        <Grid item xs={12} lg={6}>
          <Typography gutterBottom> Your publications from the last 5 years </Typography>
          {publications.series.length ?
            <Grid item xs={12}>
              <Chart options={publications.options} series={publications.series} type="bar" height={400}/>
            </Grid> :
            <Loading/>
          }
        </Grid>

        <Grid item xs={12} lg={6}>
          <Typography gutterBottom> Your tweets from the last 5 months</Typography>
          {tweets.series.length ?
            <Grid item>
              <Chart options={tweets.options} series={tweets.series} type="bar" height={400}/>
            </Grid> :
            <Loading/>
          }
        </Grid>
      </Grid>
    </Grid>
  );

  // return (
  //   <>
  //     <Grid container style={{width: "750px"}}>
  //       <Grid item xs={12}>
  //         <Typography variant="h6" style={{fontWeight: "bold"}}>
  //           Step 2: Collect publications and tweets from the last five years
  //         </Typography>
  //       </Grid>
  //       <Grid item xs={6} style={{paddingRight: 8}}>
  //         <Typography variant="body2" style={{padding: 8}}>
  //           Publications
  //         </Typography>
  //         <HowManyChart data={data}/>
  //       </Grid>
  //       <Grid item xs={6} style={{paddingRight: 8}}>
  //         <Typography variant="body2" style={{padding: 8}}>
  //           Tweets
  //         </Typography>
  //         <HowManyChart data={data}/>
  //       </Grid>
  //     </Grid>
  //
  //   </>
  // );
}

export default HowStep2

export const HowManyChart = (props) => {
  const {data} = props;

  const papers = [];
  const paperids = [];
  data.map((d) => {
    let papersHere = d.papers;
    papersHere.map((p) => {
      if (!paperids.includes(p.id)) {
        papers.push(p);
        paperids.push(p.id);
      }
    });
  });
  let years = [];
  let publications = [];
  let allYears = {};

  papers.map((d) => {
    allYears[d.year] = allYears[d.year] ? allYears[d.year] + 1 : 1;
  });

  Object.keys(allYears).map((year) => {
    years.push(year);
    publications.push(allYears[year]);
  });

  const options = {
    xaxis: {
      title: {text: "Year"},
      categories: years
    },
    yaxis: {title: {text: "Number of Publications"}}
  };

  const series = [
    {
      name: "Publications published this year",
      //the value of the bars, fetched as the weights from the keywords - Clara
      data: publications
    }
  ];

  return (
    <>
      <Chart options={options} series={series} type="bar" width="350px"/>
    </>
  );

}