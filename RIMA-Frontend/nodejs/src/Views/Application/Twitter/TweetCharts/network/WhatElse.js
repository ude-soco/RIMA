import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
// Import Highcharts
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import networkgraph from "highcharts/modules/networkgraph";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
if (typeof Highcharts === "object") {
  networkgraph(Highcharts);
}

export default function WhatElse(props) {
  const [snack, setSnack] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const [open1, setOpen1] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(true);
  };

  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen1(false);
  };

  const { vertical, horizontal, open } = snack;

  const handleClose = () => {
    setSnack({ ...snack, open: false });
  };
  const [keys, setKeys] = useState([]);
  const [addedKeys, setAddedKeys] = useState([
    "#d5f2f0",
    "#eda4a4",
    "#a2e0e0",
    "#faf2b4",
    "#edabbb",
    "#bfc2f2",
    "#f7cba6",
    "#edabbb",
    "#bfc2f2",
    "#f7cba6",
    "#c6f5bc",
    "#84848a",
  ]);
  const [state, setState] = useState({
    options: {
      chart: {
        draggable: true,
        type: "networkgraph",
        marginTop: 80,
        height: 600,
      },
      title: {
        text: "",
      },
      colors: Highcharts.getOptions().colors,

      plotOptions: {
        networkgraph: {
          keys: ["from", "to"],
          layoutAlgorithm: {
            enableSimulation: false,
            linkLength: 90,
            integration: "verlet",
            approximation: "barnes-hut",
            gravitationalConstant: 0.8,
          },
        },
      },
      series: [
        {
          dataLabels: {
            enabled: true,
            linkFormat: "",
            allowOverlap: true,
          },
          data: [],
          nodes: [],
          point: {
            events: {
              //add to interest
              click: function (event) {},
            },
          },
          cursor: "pointer",
        },
      ],
    },
  });

  useEffect(() => {
    setKeys([props.name]);
    setState({
      ...state,
      options: {
        ...state.options,

        series: [
          {
            dataLabels: {
              enabled: true,
              linkFormat: "",
              allowOverlap: true,
            },
            data: props.data,
            nodes: props.color,
            point: {
              events: {
                //add to interest
                click: function (event) {
                  if (
                    props.keys.indexOf(event.point.id) > -1 ||
                    addedKeys.indexOf(event.point.options.color) > -1
                  ) {
                    handleClick1();
                  } else {
                    props.handleAddition({
                      id: event.point.id,
                      text: event.point.id,
                    });
                    if (event.point.options.color == "#434348") {
                      event.point.options.color = "#84848a";
                    }
                    if (event.point.options.color == "#90ed7d") {
                      event.point.options.color = "#c6f5bc";
                    }
                    if (event.point.options.color == "#f7a35c") {
                      event.point.options.color = "#f7cba6";
                    }
                    if (event.point.options.color == "#8085e9") {
                      event.point.options.color = "#bfc2f2";
                    }
                    if (event.point.options.color == "#f15c80") {
                      event.point.options.color = "#edabbb";
                    }
                    if (event.point.options.color == "#e4d354") {
                      event.point.options.color = "#faf2b4";
                    }
                    if (event.point.options.color == "#2b908f") {
                      event.point.options.color = "#a2e0e0";
                    }
                    if (event.point.options.color == "#f45b5b") {
                      event.point.options.color = "#eda4a4";
                    }
                    if (event.point.options.color == "#91e8e1") {
                      event.point.options.color = "#d5f2f0";
                    }

                    setSnack({
                      open: true,
                      vertical: "bottom",
                      horizontal: "center",
                    });
                  }
                },
              },
            },
          },
        ],
      },
    });
  }, [props]);

  return (
    <>
      {" "}
      <div>
        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          message="Added to your interest"
          key={vertical + horizontal}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Added to your interest!
          </Alert>
        </Snackbar>
      </div>
      <div>
        <Snackbar
          open={open1}
          autoHideDuration={3000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={handleClose1}
        >
          <Alert
            onClose={handleClose1}
            severity="warning"
            sx={{ width: "100%" }}
          >
            already existed in your interest model!
          </Alert>
        </Snackbar>
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={state.options} />
      </div>
    </>
  );
}
