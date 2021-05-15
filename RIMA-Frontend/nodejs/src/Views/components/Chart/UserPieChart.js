import React, { Component } from "react";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import RestAPI from "Services/api";

import { handleServerErrors } from "Services/utils/errorHandler";

class UserPieChart extends Component {
  state = {
    data: [],
    series: [],

    options: {
      colors: [
        "#5ec9db",
        "#fdc765",
        "#f27d51",
        "#6462cc",
        "#FFE633",
        "#5ae2f2",
        "#707a9d",
        "#ad2aba",
        "#4c4bb4",
        "#b49b0a",
        "#FF5733",
        "#D4FF33",
        "#33FFA8",
        "#0CF3E1",
        "#0C56F3",
      ],
      chart: {
        width: 380,
        type: "pie",
      },
      fill: {
        colors: [
          "#5ec9db",
          "#fdc765",
          "#f27d51",
          "#6462cc",
          "#5ae2f2",
          "#707a9d",
          "#ad2aba",
          "#4c4bb4",
          "#b49b0a",
          "#FF5733",
          "#FFE633",
          "#D4FF33",
          "#33FFA8",
          "#0CF3E1",
          "#0C56F3",
        ],
      },

      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 50,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  componentDidMount() {
    this.setState({ isLoding: true }, () => {
      RestAPI.pieChartUser()
        .then((response) => {
          let mydata = response.data.map((val) => val.keyword);
          let values = response.data.map((val) => val.weight);

          this.setState({
            isLoding: false,
            data: response.data,
            series: values,
            options: {
              ...this.state.options,
              labels: mydata,
            },
          });
        })
        .catch((error) => {
          this.setState({ isLoding: false });
          handleServerErrors(error, toast.error);
        });
    });
  }

  render() {
    return (
      <div id="chart">
        {this.state.isLoding ? (
          <div className="text-center" style={{ padding: "20px" }}>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : this.state.data.length ? (
          <>
            <div style={{ maxWidth: "560px", margin: "35px auto" }}>
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="pie"
                width="400"
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

export default UserPieChart;
