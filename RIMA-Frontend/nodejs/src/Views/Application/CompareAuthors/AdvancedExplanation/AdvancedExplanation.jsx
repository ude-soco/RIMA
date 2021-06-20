import React, {useEffect, useState} from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import {getUserInfo} from "../../../../Services/utils/functions";
import Chart from "react-apexcharts";

const option = {
  chart: {
    type: "bar",
    stacked: true
  },
  colors: ["#008FFB", "#FF4560"],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "80%"
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ["#fff"]
  },
  grid: {
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  yaxis: {
    min: -5,
    max: 5,
  },
  tooltip: {
    shared: false,
    x: {
      formatter: function (val) {
        return val;
      }
    },
    y: {
      formatter: function (val) {
        return Math.abs(val);
      }
    }
  },
}

export default function AdvancedExplanation({classes, loading, similarityScores, compareAuthor}) {
  const currentUser = getUserInfo();
  const [state, setState] = useState({
    series: [],
    options: {
      ...option,
      xaxis: {
        categories: [],
        title: {
          text: "Weights"
        },
        labels: {
          formatter: function (val) {
            return Math.abs(Math.round(val));
          }
        }
      }
    }
  });

  useEffect(() => {
    const {bar_chart_data: {user_1_data}} = similarityScores;
    const {bar_chart_data: {user_2_data}} = similarityScores;

    setState({
      ...state,
      series: [
        {
          name: `${currentUser.first_name} ${currentUser.last_name}`,
          data: Object.values(user_1_data).map(function (x) {
            return x * -1;
          })
        },
        {name: `${compareAuthor.first_name} ${compareAuthor.last_name}`, data: Object.values(user_2_data)}
      ],
      options: {
        ...state.options,
        xaxis: {
          ...state.options.xaxis,
          categories: Object.keys(user_1_data)
        }
      }
    })

  }, [])

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Advanced Explanation: Weight-based similarity of users’ interest models</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>
      <Grid container className={classes.gutterLarge}>
        <Grid item xs>
          {state.series.length ? <Chart options={state.options} series={state.series} type="bar" height={450}/> :
            <> {loading} </>
          }
        </Grid>
      </Grid>
    </>
  );
}
