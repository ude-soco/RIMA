import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {toast} from "react-toastify";
import RestAPI from "Services/api";

import {handleServerErrors} from "Services/utils/errorHandler";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import {getColorArray} from "../../../../assets/functions/functions";

const height = 400

export default function Activities({classes, loading}) {
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
      xaxis: {title: {text: "Year"}, categories: []},
      yaxis: {title: {text: "Number of tweets"}}
    }
  });

  useEffect(() => {
    if (!publications.series.length) {
      RestAPI.barChart()
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
      <Grid item xs={12} lg={8}>
        <Card className={classes.cardHeight}>
          <CardContent>
            <Typography variant="h5" gutterBottom> Activities: Publications and Twitter </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <Typography gutterBottom> The number of publications published in the last 5 years </Typography>
                {publications.series.length ?
                  <Grid item xs={12}>
                    <Chart options={publications.options} series={publications.series} type="bar" height={height}/>
                  </Grid> :
                  <> {loading} </>
                }
              </Grid>

              <Grid item xs={12} lg={6}>
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
      </Grid>
    </>
  );
}

// export default class Activities extends Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       options: {
//         chart: {
//           id: "basic-bar",
//         },
//         fill: {
//           colors: ["#9C27B0"],
//         },
//         xaxis: {
//           categories: [],
//         },
//       },
//       series: [],
//       tweetoptions: {
//         chart: {
//           id: "basic-bar",
//         },
//         xaxis: {
//           categories: [],
//         },
//       },
//       tweetSeries: [],
//     };
//   }
//
//   componentDidMount() {
//     this.setState({isLoading: true}, () => {
//       RestAPI.barChart()
//         .then((response) => {
//           let categoryList = Object.keys(response.data.papers);
//           let value = Object.values(response.data.papers);
//           let tweetCategoryList = Object.keys(response.data.tweets);
//           let tweetValues = Object.values(response.data.tweets);
//           console.log(response.data.tweets);
//           this.setState({
//             isLoading: false,
//             data: response.data,
//             series: [{name: "Paper", data: [...value]}],
//             tweetSeries: [{name: "Tweet", data: [...tweetValues]}],
//             // options: { ...this.state.options, ...this.state.options.xaxis, ...this.state.options.xaxis.categories = categoryList },
//             // tweetoptions: { ...this.state.tweetoptions, ...this.state.tweetoptions.xaxis, ...this.state.tweetoptions.xaxis.categories = tweetCategoryList },
//             options: {
//               chart: {
//                 id: "basic-bar",
//               },
//
//               fill: {
//                 colors: ["#9C27B0"],
//               },
//               xaxis: {
//                 categories: [...categoryList],
//               },
//             },
//             tweetOptions: {
//               chart: {
//                 id: "basic-bar",
//               },
//               xaxis: {
//                 categories: [...tweetCategoryList],
//               },
//             },
//           });
//         })
//         .catch((error) => {
//           this.setState({isLoading: false});
//           handleServerErrors(error, toast.error);
//         });
//     });
//   }
//
//   render() {
//     return (
//
//       <>
//         <Grid item xs={12} lg={8}>
//           <Card className={this.props.classes.cardHeight}>
//             <CardContent>
//               <Typography variant="h5" gutterBottom> Activities: Publications and Twitter </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} lg={6}>
//
//                   <Typography gutterBottom> The number of publications published in the last 5 years </Typography>
//                   {this.state.isLoading ?
//                     <CircularProgress/> :
//                     <Grid item xs={12}>
//                       <Chart
//                         options={this.state.options}
//                         series={this.state.series}
//                         type="bar"
//                         // width="600"
//                       />
//                     </Grid>
//                   }
//                   <p className="h1-s rtl">Quantity</p>
//                   <p className="h1-s">Year</p>
//                 </Grid>
//
//                 <Grid item xs={12} lg={6}>
//                   <Typography gutterBottom> The number of tweets in the last 6 months.</Typography>
//                   {this.state.isLoading ?
//                     <CircularProgress/> :
//                     <Grid item>
//                       <Chart
//                         options={this.state.tweetOptions}
//                         series={this.state.tweetSeries}
//                         type="bar"
//                         // width="600"
//                       />
//                     </Grid>
//                   }
//
//                 </Grid>
//               </Grid>
//
//             </CardContent>
//           </Card>
//         </Grid>
//       </>
//     );
//   }
// }
