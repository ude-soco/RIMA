import { Grid, Paper, Typography, Select, MenuItem } from "@mui/material";
import { BASE_URL_CONFERENCE } from "Services/constants";
import React, { useState } from "react";
import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import InfoBox from "../ReuseableComponents/InfoBox";

const InterestsAnalysis = ({ authorProp }) => {
  const [minCount, setMinCount] = useState(1);
  const [option, setOption] = useState({
    options: {
      chart: {
        type: "bar",
        stacked: true,
      },
      xaxis: {
        categories: ["2011", "2012", "2013"],
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      legend: {
        position: "right",
      },
    },
  });
  const [series, setSeries] = useState([
    {
      name: "keyword1",
      data: [3, 2, 1],
    },
    {
      name: "keyword2",
      data: [1, 0, 2],
    },
    {
      name: "keyword3",
      data: [0, 1, 0],
    },
  ]);
  const [fetchedData, setFetchedData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [authorProp]);

  const getData = async () => {
    setShowWarning(false);
    setLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorInterestes/" + authorProp.label
    );
    const response = await request.json();
    let opt = {
      options: {
        chart: {
          type: "bar",
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        xaxis: {
          categories: response.categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        legend: {
          position: "right",
        },
      },
    };
    console.log("response option: ", response.categories);
    console.log("series", response.series);
    if (response.categories.length == 0) {
      setShowWarning(true);
    }
    setOption(opt);
    setSeries(response.series);
    setLoader(false);
    setFetchedData(response);
  };

  const handleCountChange = (e) => {
    setMinCount(parseInt(e.target.value));
  };

  useEffect(() => {
    if (fetchedData !== null) {
      updateChartData(fetchedData);
    }
  }, [minCount]);

  const updateChartData = (data) => {
    setLoader(true);
    let filteredSeries = data.series.filter((item) => {
      let count = item.data.reduce(
        (total, val) => total + (val > 0 ? 1 : 0),
        0
      );
      return count >= minCount;
    });

    let opt = {
      options: {
        chart: {
          type: "bar",
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        xaxis: {
          categories: data.categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        legend: {
          position: "right",
        },
      },
    };

    setOption(opt);
    setSeries(filteredSeries);
    setLoader(false);
  };
  return (
    <Grid
      container
      alignContent="center"
      alignItems="center"
      style={{
        padding: "2%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Grid container xs={12} marginBottom={"6%"}>
        <Grid item xs={12} marginBottom={"1%"}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            {authorProp.name} Interests Over Time
          </Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}>
            <Typography variant="h6">
              This stacked bar chart represents the frequency of an{" "}
              {authorProp.name}'s topics across different years. Each bar in the
              chart corresponds to a year, and each segment of a bar represents
              a topic. The size of the segment reflects the number of
              publications released by the
              {authorProp.name} that mentioned the respective topic within that
              year.
            </Typography>
            {showWarning && (
              <Typography
                style={{ fontWeight: "bold", color: "#BC211D" }}
                variant="h6"
                gutterBottom
              >
                {" "}
                No topics available for this author
              </Typography>
            )}
            <Grid item justify="center" alignItems="center">
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => setImageTooltipOpen(true)}
                onMouseOut={() => setImageTooltipOpen(false)}
              >
                {imageTooltipOpen && (
                  <InfoBox
                    marginLeft={"10%"}
                    style={{
                      transform: "translateX(-50%)",
                    }}
                    Info={`Use the 'Minimum Count' dropdown to filter keywords
                     that appear in at least a certain number of years.
                     For example, selecting '2' will only display keywords that
                     appear in two or more years. This feature helps to highlight
                     the most persistent interests of the author over time.`}
                  />
                )}
              </i>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1} marginBottom="2%" borderRadius="40px">
        <Paper>
          <Typography variant="body1">Minimum Count:</Typography>
          <Select
            value={minCount}
            onChange={handleCountChange}
            style={{ width: "100%" }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </Paper>
      </Grid>
      <ActiveLoader
        marginLeft={"35%"}
        height={80}
        width={80}
        visible={loader}
      />
      <Grid item xs={12}>
        <Paper style={{ borderRadius: "40px", padding: "2%" }}>
          <ReactApexChart
            options={option.options}
            series={series}
            type="bar"
            height={400}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InterestsAnalysis;
