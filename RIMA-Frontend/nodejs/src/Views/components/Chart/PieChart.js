import React from "react";
import Chart from "react-apexcharts";
import {toast} from "react-toastify";
import Loader from "react-loader-spinner";
import RestAPI from "Services/api";

import {handleServerErrors} from "Services/utils/errorHandler";
import {getColorArray} from "../../../Services/utils/functions";

class PieChart extends React.Component {
  state = {
    data: [],
    series: [],

    options: {
      colors: [
        // "#5ec9db",
        // "#fdc765",
        // "#f27d51",
        // "#6462cc",
        // "#FFE633",
        // "#5ae2f2",
        // "#707a9d",
        // "#ad2aba",
        // "#4c4bb4",
        // "#b49b0a",
        // "#FF5733",
        // "#FFE633",
        // "#D4FF33",
        // "#33FFA8",
        // "#0CF3E1",
        // "#0C56F3",
      ],
      chart: {
        width: 900,
        type: "pie",
      },
      fill: {
        colors: [
          // "#5ec9db",
          // "#fdc765",
          // "#f27d51",
          // "#6462cc",
          // "#FFE633",
          // "#5ae2f2",
          // "#707a9d",
          // "#ad2aba",
          // "#4c4bb4",
          // "#b49b0a",
          // "#FF5733",
          // "#FFE633",
          // "#D4FF33",
          // "#33FFA8",
          // "#0CF3E1",
          // "#0C56F3",
        ],
      },

      labels: [],
      // responsive: [
      //   {
      //     breakpoint: 800,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //     },
      //   },
      // ],
      legend: {
        position: 'bottom'
      },
    },
  };

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      RestAPI.cloudChart()
        .then((response) => {
          let myData = [];
          let values = [];
          // let mydata = response.data.map((val) => val.keyword);
          // let values = response.data.map((val) => val.weight);
          for (let i = 0; i < response.data.length; i++) {
            myData.push(response.data[i].keyword);
            values.push(response.data[i].weight);
            if (i === 4) {
              console.log(i);
              break;
              }
          }
          console.log(response.data);
          let colors = getColorArray(myData.length)
          this.setState({
            isLoading: false,
            data: response.data,
            series: values,
            options: {
              ...this.state.options,
              colors: colors,
              fill: {
                colors: colors
              },
              labels: myData,
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
    console.log(getColorArray(5));
    return (
      <div align="center" id="chart">
        {this.state.isLoading ? (
          <div className="text-center" style={{padding: "20px"}}>
            <Loader type="Puff" color="#00BFFF" height={100} width={100}/>
          </div>
        ) : this.state.data.length ? (
          <>
            <div style={{
              // maxWidth: "800px",
              // margin: "35px auto"
            }}>
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="pie"
                // width="500"
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <strong>No data available</strong>
          </div>
        )}
      </div>
    );
  }
}

export default PieChart;
