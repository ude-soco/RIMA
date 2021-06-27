import React, {useEffect, useState} from "react";
import {Box, Divider, Grid, Typography} from "@material-ui/core";
import Chart from "react-apexcharts";
import {getUserInfo} from "../../../../Services/utils/functions";

const option = {
  legend: {
    show: true,
    position: "right",
    horizontalAlign: "center"
  },
  dataLabels: {
    enabled: true
  },
  colors: ["#008FFB"],
  xaxis: {
    title: {
      text: ""
    },
  },
  yaxis: {
    title: {
      text: "",
    },
  },
}

export default function IntermediateExplanation({classes, loading, similarityScores, compareAuthor}) {
  const currentUser = getUserInfo();
  const [state, setState] = useState({
    series: [],
    options: {
      ...option
    }
  });

  useEffect(() => {
    const {heat_map_data} = similarityScores;
    const names = Object.keys(heat_map_data);
    const values = Object.values(heat_map_data);
    let series = [];

    // console.log(values)
    for (const i in names) {
      let keys = Object.keys(values[i]);
      let val = Object.values(values[i]);
      let data = []
      for (const j in keys) {
        // console.log(keys[j])
        data.push({
          x: keys[j],
          y: val[j].toFixed(2)
        })
      }
      series.push({name: names[i], data: data});
    }
    // console.log(series);
    setState({
      ...state,
      series: series,
      options: {
        ...state.options,
        xaxis: {
          ...state.options.xaxis,
          title: {
            text: `${compareAuthor.first_name} ${compareAuthor.last_name}`
          },
        },
        yaxis: {
          ...state.options.yaxis,
          title: {
            text: `${currentUser.first_name} ${currentUser.last_name}`
          },
        }
      }
    })

  }, []);

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Intermediate Explanation: Semantic-based similarity of users’ interest models</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterLarge}>
        <Grid item xs>
          {state.series.length ?
            <Box>
              <Chart options={state.options} series={state.series} type="heatmap" height={500} />
            </Box> : <> {loading} </>
          }
        </Grid>
      </Grid>
    </>
  );
}
