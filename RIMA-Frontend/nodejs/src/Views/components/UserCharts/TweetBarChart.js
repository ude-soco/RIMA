import React, { Component } from "react";
import { toast } from "react-toastify";
import { handleServerErrors } from "Services/utils/errorHandler";
import RestAPI from "../../../Services/api";
import Chart from "react-apexcharts";
import "d3-transition";
import Loader from "react-loader-spinner";
import "react-tabs/style/react-tabs.css";

class TweetBar extends Component {
  state = {
    options: {
      chart: {
        id: "basic-bar",
      },

      fill: {
        colors: ["#9C27B0"],
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
    tweetoptions: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [],
      },
    },
    tweetseries: [],
  };

  componentDidMount() {
    this.setState({ isLoding: true }, () => {
      RestAPI.barChart()
        .then((response) => {
          let tweetscategorieList = Object.keys(response.data.tweets);
          let tweetsvalue = Object.values(response.data.tweets);
          this.setState({
            isLoding: false,
            data: response.data,
            tweetseries: [{ name: "Tweet", data: [...tweetsvalue] }],
            tweetoptions: {
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories: [...tweetscategorieList],
              },
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
      <>
        {this.state.isLoding ? (
          <div className="text-center" style={{ padding: "20px" }}>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          <div
            className="mixed-chart"
            style={{ width: "450px", margin: "0 auto" }}
          >
            <h2>Tweet Information</h2>
            <Chart
              options={this.state.tweetoptions}
              series={this.state.tweetseries}
              type="bar"
              width="350"
              height="250"
              id="chart-1"
            />
            <p className="h1-s rtl-1" style={{ marginTop: "-300px" }}>
            Quantity
            </p>
            <p className="h1-s" style={{ width: "350px", marginLeft: "50px" }}>
              Year
            </p>
          </div>
        )}
      </>
    );
  }
}

export default TweetBar;
