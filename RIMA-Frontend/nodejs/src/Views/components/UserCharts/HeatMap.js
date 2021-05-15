import React, { Component } from "react";
import { Chart } from "@antv/g2";
import { handleServerErrors } from "Services/utils/errorHandler";
import RestAPI from "../../../Services/api";
import { toast } from "react-toastify";
import { getItem } from "Services/utils/localStorage";
import Loader from "react-loader-spinner";

class HeatMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Loader: false,
    };
  }

  componentDidMount() {
    this.setState({ Loader: true }, () => {
      RestAPI.getScore(getItem("userId"))
        .then((response) => {
          this.setState({
            Loader: false,
          });
          const datas = response.data.heat_map_data;
          let name = Object.keys(datas);
          const field = [];
          const values = [];
          datas &&
            Object.keys(datas).map((data1, idx) => {
              Object.keys(datas[data1]).map((data2, idx) => {
                field.push(data2);
                values.push(parseFloat(datas[data1][data2].toFixed(2)));
              });
            });
          const fields = [];
          for (let i = 0; i < field.length; i++) {
            if (field[i] === fields[0]) {
              break;
            } else {
              fields.push(field[i]);
            }
          }
          const data = [];
          for (let i = 0; i < fields.length; i++) {
            for (let p = 0; p < fields.length; p++) {
              let k = data.length;
              data.push([i, p, values[k]]);
            }
          }
          console.log("values", values);

          const source = data.map((arr) => {
            return {
              name: arr[0],
              day: arr[1],
              score: arr[2],
            };
          });

          const chart = new Chart({
            container: "heatmap",
            autoFit: true,
            height: 550,
          });

          chart.data(source);

          chart.scale("name", {
            type: "cat",
            values: name,
          });
          chart.scale("day", {
            type: "cat",
            values: fields,
          });
          chart.scale("score", {
            nice: true,
          });

          chart.axis("name", {
            tickLine: null,
            grid: {
              alignTick: false,
              line: {
                style: {
                  lineWidth: 1,
                  lineDash: null,
                  stroke: "#f0f0f0",
                },
              },
            },
          });

          chart.axis("day", {
            title: null,
            grid: {
              alignTick: false,
              line: {
                style: {
                  lineWidth: 1,
                  lineDash: null,
                  stroke: "#f0f0f0",
                },
              },
            },
          });

          chart.tooltip({
            showMarkers: false,
          });

          chart
            .polygon()
            .position("name*day")
            .color("score", "#BAE7FF-#1890FF-#0050B3")
            .label("score", {
              offset: -2,
              style: {
                fill: "#fff",
                shadowBlur: 2,
                shadowColor: "rgba(0, 0, 0, .45)",
              },
            })
            .style({
              lineWidth: 1,
              stroke: "#fff",
            });

          chart.interaction("element-active");

          chart.render();
        })
        .catch((error) => {
          handleServerErrors(error, toast.error);
        });
    });
  }

  render() {
    return (
      <>
        {this.state.Loader ? (
          <div className="text-center" style={{ padding: "20px" }}>
            <Loader type="Puff" color="#00BFFF" height={100} width={100} />
          </div>
        ) : (
          <div id="heatmap" />
        )}
      </>
    );
  }
}

export default HeatMap;
