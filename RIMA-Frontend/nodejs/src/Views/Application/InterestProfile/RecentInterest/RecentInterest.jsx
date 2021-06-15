import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import {Card, CardContent, Typography} from "@material-ui/core";
import RestAPI from "../../../../Services/api";
import {handleServerErrors} from "../../../../Services/utils/errorHandler";
import {toast} from "react-toastify";

export default function RecentInterest({classes, loading}) {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      labels: [],
      legend: {
        position: 'bottom'
      },
    },
  });

  useEffect(() => {
    RestAPI.cloudChart()
      .then((response) => {
        let myData = [];
        let values = [];
        for (let i = 0; i < response.data.length; i++) {
          myData.push(response.data[i].keyword);
          values.push(response.data[i].weight);
          if (i === 4) break;
        }
        setState({
          ...state,
          series: values,
          options: {
            ...state.options,
            labels: myData,
          },
        });

      })
      .catch((error) => {
        handleServerErrors(error, toast.error);
      });
  }, [])


  return (
    <>
      <Card className={classes.cardHeight}>
        <CardContent>
          <Typography variant="h5" gutterBottom> Recent Interest </Typography>
          <Typography gutterBottom>
            This chart shows your recent interests in the last year (for publications), and last month (for tweets).
          </Typography>

          {state.series.length ? <Chart options={state.options} series={state.series} type="pie"/> : <> {loading} </>}
        </CardContent>
      </Card>
    </>
  );
}
