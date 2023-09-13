import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Typography,
} from "@mui/material";
import { BASE_URL_CONFERENCE } from "Services/constants";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import FilterButton from "./FilterButton";

const ChartComponent = ({ AuthorName }) => {
  const [conferences, setConferences] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredConfsName, setFilteredConfsName] = useState([]);

  const [series, setSeries] = useState([
    {
      name: "Publications",
      type: "column",
      data: [10, 15, 7, 14],
    },
    {
      name: "Citations",
      type: "line",
      data: [30, 20, 50, 40],
    },
  ]);
  const [origionalSeries, setOrigionalSeries] = useState(series);
  const [origionalOptions, setOrigionalOptions] = useState(options);
  const [options, setOption] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    title: {
      text: "Publications and Citations",
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: ["2018", "2019", "2020", "2021"],
    yaxis: [
      {
        title: {
          text: "Publications",
        },
      },
      {
        opposite: true,
        title: {
          text: "Citations",
        },
      },
    ],
  });
  const [optionChecked, setOptionChecked] = useState(
    Array(filterOptions.length).fill(false)
  );
  useEffect(() => {
    getAuthorPublicationCitation();
  }, []);

  useEffect(() => {
    getAuthorPublicationCitation();
  }, [AuthorName]);

  const getAuthorPublicationCitation = async () => {
    setLoader(true);
    setFilterOptions([]);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "author/" +
        AuthorName.label +
        "/publications/citations/inConferences/All Conferences/"
    );
    const respone = await request.json();

    setSeries(respone.series);
    setOption({
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Publications and Citations",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: respone.categories,
      xaxis: {},
      yaxis: [
        {
          title: {
            text: "Publications",
          },
        },
        {
          opposite: true,
          title: {
            text: "Citations",
          },
        },
      ],
    });
    setLoader(false);
    setFilteredConfsName(respone.conferences);
    setFilterOptions(respone.conferences);
  };

  const getAuthorPublicationCitationFilterBased = async () => {
    setLoader(true);
    let selectedIndex = getSelectedEvents();
    if (selectedIndex.length == 0) {
      setOption(origionalOptions);
      setSeries(origionalSeries);
      setFilteredConfsName(filterOptions);
      setLoader(false);
      return;
    }
    let filteredConfs = selectedIndex.map((index) => filterOptions[index]);
    setFilteredConfsName(filteredConfs);

    const request = await fetch(
      BASE_URL_CONFERENCE +
        "author/" +
        AuthorName.label +
        "/publications/citations/inConferences/" +
        filteredConfs.join("&") +
        "/"
    );
    const response = await request.json();
    setOrigionalSeries(response.series);
    setSeries(response.series);
    setOption({
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Publications & citation trends",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: response.categories,
      xaxis: {},
      yaxis: [
        {
          title: {
            text: "Total no. of publications",
          },
        },
        {
          opposite: true,
          title: {
            text: "Total no. of citations",
          },
        },
      ],
    });
    setOrigionalOptions({
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Publications & citation trends",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: response.categories,
      xaxis: {},
      yaxis: [
        {
          title: {
            text: "Total no. of publications",
          },
        },
        {
          opposite: true,
          title: {
            text: "Total no. of citations",
          },
        },
      ],
    });
    setFilteredConfsName(filteredConfs);
    setConferences(response.conferences);
    setLoader(false);
  };
  const handleToggle = (index) => {
    const newOptionChecked = [...optionChecked];
    newOptionChecked[index] = !newOptionChecked[index];
    setOptionChecked(newOptionChecked);
  };
  const getSelectedEvents = () => {
    let selectedIndex = [];
    optionChecked.forEach((option, index) => {
      if (option) {
        selectedIndex.push(index);
      }
    });
    return selectedIndex;
  };
  const handleOnSaveCliced = () => {
    getAuthorPublicationCitationFilterBased();
  };
  return (
    <Grid
      container
      xs={12}
      style={{
        padding: "2%",
        margin: "1%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Typography
        style={{ fontWeight: "bold" }}
        variant="h5"
        component="h1"
        gutterBottom
      >
        {AuthorName.name}'s Academic Productivity and Impact Over Time
      </Typography>
      <Typography variant="h6" gutterBottom>
        The <b>bars </b>represent the total number of <b>publications</b>{" "}
        published by{" "}
        <b>
          {AuthorName.name} in ( {filteredConfsName.join(", ")}){" "}
        </b>
        for each year.Meanwhile, the <b>line </b>indicates the
        <b> total number of citations </b>that all of the author's publications
        have <b>received in that respective year</b>.
      </Typography>
      <br />

      <Paper
        sx={{
          width: "100%",
          padding: "1%",
          borderRadius: "40px",
        }}
      >
        <Grid container xs={12}>
          <Grid
            item
            sx={{
              marginLeft: "90%",
            }}
          >
            <Tooltip title="Filter" placement="top-end">
              <IconButton aria-label="filter">
                <FilterButton
                  optionsProps={filterOptions}
                  handleToggleProps={handleToggle}
                  checkedProps={optionChecked}
                  onSaveClickedProps={handleOnSaveCliced}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div id="chart">
            <ActiveLoader height={50} width={50} visible={loader} />
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={400}
            />
          </div>
        </Grid>{" "}
      </Paper>
    </Grid>
  );
};

export default ChartComponent;
