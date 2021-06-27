import React, {useEffect, useState} from "react";
import Chart from "react-apexcharts";
import RestAPI from "../../../../Services/api";
import {handleServerErrors} from "../../../../Services/utils/errorHandler";
import {toast} from "react-toastify";

export default function RecentInterest({loading, height, user}) {
  const [state, setState] = useState({
    series: [],
    options: {
      labels: [],
      legend: {
        position: 'bottom'
      },
    },
  });


  useEffect(() => {
    if (!state.series.length) {
      // TODO: this should be short term interest
      RestAPI.shortTermInterest(user)
      // RestAPI.longTermInterest(user)
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
    }
  }, [])


  return (
    <>
      {state.series.length ?
        <Chart options={state.options} series={state.series} type="pie" height={height}/> :
        <> {loading} </>
      }
    </>
  );
}
