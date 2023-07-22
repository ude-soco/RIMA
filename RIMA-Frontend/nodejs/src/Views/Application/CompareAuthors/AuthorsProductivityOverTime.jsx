// created by Islam Abdelghaffar

import {
  IconButton,
  Tooltip,
  Grid,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { BASE_URL_CONFERENCE } from "Services/constants";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import RIMAButton from "../ReuseableComponents/RIMAButton";

const AuthorsProductivityOverTime = () => {
  const [authors, setAuthors] = useState([{ name: "A1", label: 1 }]);
  const [selectedConferences, setSelectedConferences] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedAuthorsNames, setSelectedAuthorsNames] = useState([]);
  const [availableConfs, setConferences] = useState([]);
  const [activeButton, setActiveButton] = useState(false);
  const [compareClicked, setCompareClicked] = useState(false);
  const [option, setOption] = useState({});
  const [series, setSeries] = useState([]);
  const [loader, setActiveLoader] = useState(false);
  useEffect(() => {
    getCoauthorEvolution();
    getAllAuthorsDB();
    getAllAvailbelConfs();
  }, []);

  const getCoauthorEvolution = async () => {
    if (selectedAuthors.length == 0) {
      return;
    }
    console.log("selectedAuthors: ", selectedAuthors);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "AuthorProductivityEvolution/" +
        selectedAuthors.join("&") +
        "/" +
        selectedConferences.join("&")
    );
    const response = await request.json();
    const extractedOptions = response[0].categories;
    const extractedSeries = response[0].data.map((item) => ({
      name: item.series.name,
      data: item.series.data,
    }));
    console.log("extractedOptions: ", extractedOptions);
    console.log("extractedSeries: ", extractedSeries);
    setOption({
      chart: {
        id: "co-author-evolution",
      },
      stroke: {
        curve: "smooth",
        width: 5,
      },
      xaxis: {
        categories: extractedOptions,
      },
      title: {
        text: `Co-Author Evolution Comparison Between Authors in ${availableConfs.join(
          " and "
        )} conferences`,
        align: "center",
      },
      subtitle: {
        align: "left",
      },
    });
    setSeries(extractedSeries);
  };
  const getAllAuthorsDB = async () => {
    setActiveLoader(true);
    const request = await fetch(BASE_URL_CONFERENCE + "getAllAvailabeAuthors");

    const response = await request.json();
    setAuthors(response);
    console.log("authors", response);
    setActiveLoader(false);
  };
  const getAllAvailbelConfs = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAllAvailableConferences/"
    );
    const response = await request.json();
    const confs = extractConfsNames(response);
    setConferences(confs);
  };
  const extractConfsNames = (conferences) => {
    const confs = [];
    conferences.forEach((conf) => {
      if (conf.name !== "All Conferences") confs.push(conf.name);
    });
    return confs;
  };
  const handleCompare = () => {
    setCompareClicked(true);
    getCoauthorEvolution();
  };
  return (
    <Grid>
      <Grid
        container
        style={{
          padding: "2%",
          backgroundColor: "#F0F8FF",
          borderRadius: "40px",
        }}
      >
        <Grid container xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            Comparing the Evolution of Academic Productivity Among Authors
          </Typography>
          <Grid container xs={12}>
            <Typography variant="h6">
              This line chart visualizes the evolution of each author's
              publications count over the years. Each line represents a specific
              author, tracking the count of their publications on a year-by-year
              basis.
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={12}>
          <Autocomplete
            disablePortal
            multiple={true}
            id="combo-box-demo"
            options={authors}
            key={(option) => option.label}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Author" />}
            sx={{ width: "100%", marginBottom: "1%" }}
            onChange={(event, newInputValue) => {
              if (newInputValue) {
                var labels = newInputValue.map((v) => v.label);
                var names = newInputValue.map((v) => v.name);

                setSelectedAuthors(labels);
                setSelectedAuthorsNames(names);
              }
            }}
          />
        </Grid>
        <Grid container xs={6}>
          <Box sx={{ minWidth: "100%" }}>
            <Autocomplete
              disablePortal
              multiple={true}
              id="combo-box-demo"
              options={availableConfs}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Conferences" />
              )}
              sx={{ width: "100%", marginBottom: "1%" }}
              onChange={(event, newInputValue) => {
                if (newInputValue) {
                  setSelectedConferences(newInputValue);
                }
              }}
            />
          </Box>
          <Grid>
            <RIMAButton
              name="Compare"
              onClick={handleCompare}
              activeButton={activeButton}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} style={{ padding: "1%", marginTop: "2%" }}>
          <Paper
            sx={{
              width: "100%",
              padding: "1%",
              borderRadius: "40px",
            }}
          >
            <ReactApexChart
              options={option}
              series={series}
              type="line"
              width="100%"
              height={350}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default AuthorsProductivityOverTime;
