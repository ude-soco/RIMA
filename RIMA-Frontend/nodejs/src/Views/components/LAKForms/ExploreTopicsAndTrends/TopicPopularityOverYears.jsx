// created by Islam Abdelghaffar
import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { Component } from "react";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import ".././styles.css";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import InfoBox from "../../../Application/ReuseableComponents/InfoBox";
import GroupBarChart from "../../../Application/ReuseableComponents/GroupBarChart.jsx";
import SelectWithCancelIcon from "../../../Application/ReuseableComponents/SelectWithCancelIcon.jsx";
import PublicationDialog from "../../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

const TopicPopularityOverYears = ({ selectedConferenceProps, confEvents }) => {
  const [series, setSeries] = useState([
    {
      name: "analytics",
      data: [20, 0, 0, 0, 15, 20, 0, 0, 0, 15],
    },
    { name: "AI", data: [10, 0, 0, 20, 25, 10, 0, 0, 20, 25] },
    { name: "ML", data: [15, 0, 30, 0, 10, 20, 0, 0, 20, 10] },
    {
      name: "Learning",
      data: [20, 0, 0, 20, 10, 15, 0, 30, 0, 10],
    },
  ]);
  const [selectedConference, setSelectedConference] = useState(
    selectedConferenceProps
  );
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [ResetBtnactive, setResetBtnactive] = useState(false);
  const [CompareBtnactive, setCompareBtnactive] = useState(false);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [numerOfTopics, setNumberOfTopics] = useState([5, 10, 15, 20]);
  const [selectedNumber, setSelectedNumber] = useState();
  const [loader, setLoader] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    setSelectedConference(selectedConferenceProps);
    console.log("selected: ", selectedConference);
  }, [selectedConferenceProps]);

  useEffect(() => {
    getPublicationsCounts();
    console.log(" get publications called");
  }, [selectedConference]);

  useEffect(() => {
    getPublicationList();
  }, [selectedEvent, selectedWord]);

  const plotOptions = {
    bar: {
      horizontal: false,
      dataLabels: { position: "top" },
      columnWidth: "70%",
      barGap: "0%",
      distributed: false,
    },
  };

  const [options, setOptions] = useState({
    chart: {
      stroke: {
        curve: "smooth",
      },
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedEvent = config.w.globals.labels[config.dataPointIndex];
          const selectedword = config.w.config.series[config.seriesIndex].name;
          setSelectedEvent(selectedEvent);
          setSelectedWord(selectedword);
        },
      },
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });

  const getPublicationsCounts = async () => {
    if (selectedEvents.length == 0) {
      return;
    }
    setCompareBtnactive(true);
    setResetBtnactive(false);
    setLoader(true);
    const request = await fetch(
      `${BASE_URL_CONFERENCE}` +
        "getTopicPopularityAcrossYears/" +
        selectedEvents.join("&") +
        "/" +
        selectedNumber +
        "/" +
        checked
    );
    const response = await request.json();
    console.log("response", response);
    setSeries(response.data);
    setOptions({
      chart: { type: "bar", height: 350 },
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { position: "top" },
          borderRadius: 4,
          columnWidth: "75%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontWeight: 700,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c49c94",
      ],
      xaxis: {
        categories: response.years,
      },
    });
    setLoader(false);
  };
  const handleToogle = (status) => {
    setImageTooltipOpen(status);
  };

  const handleCloseDiaglog = () => {
    setOpenDiaglog(false);
  };

  const getPublicationList = async () => {
    if (selectedEvent == "" || selectedWord == "") {
      return;
    }
    console.log("selectedEvent: ", selectedEvent);
    console.log("selectedWord: ", selectedWord);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getRelaventPublicationsList/keyword/" +
        selectedEvent +
        "&" +
        selectedWord
    );

    const response = await request.json();
    console.log("response00: ", response["publicationList"]);
    setOpenDiaglog(true);
    setPublicationList(response["publicationList"]);
  };

  return (
    <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
      <Grid item xs={12}>
        <Typography
          style={{ fontWeight: "bold" }}
          variant="h5"
          component="h1"
          gutterBottom
        >
          Topic Popularity Comparison Across years in {selectedConferenceProps}{" "}
          Conference
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography style={{ paddingTop: "1%" }}>
          This visualization displays the comparison of topics over multiple
          years
        </Typography>
      </Grid>
      <Grid container xs={12} style={{ paddingTop: "1%" }}>
        <Grid item xs={12}>
          <Grid item xs={12} md={5}>
            <FormControl
              sx={{ m: 1, minWidth: "100%", backgroundColor: "white" }}
            >
              <InputLabel>Select one Event or more*</InputLabel>
              <Select
                labelId="First Event"
                value={selectedEvents}
                onChange={(e) => {
                  setSelectedEvents(e.target.value || []);
                  console.log("events: ", selectedEvents);
                }}
                renderValue={(selected) => selected.join(", ")}
                multiple
                fullWidth={true}
              >
                {confEvents.map((event) => {
                  return (
                    <MenuItem key={event.label} value={event.label}>
                      {event.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid container xs={12}>
            <Grid item md={4} xs={12}>
              <FormControl
                sx={{ m: 1, minWidth: "100%", backgroundColor: "white" }}
              >
                <InputLabel>Select Number of Topics*</InputLabel>
                <Select
                  labelId="No. Topics"
                  value={selectedNumber}
                  onChange={(e) => {
                    setSelectedNumber(e.target.value);
                  }}
                  fullWidth={true}
                >
                  {numerOfTopics.map((event) => {
                    return (
                      <MenuItem key={event} value={event}>
                        {event}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
              <InputLabel>Show only shared topics</InputLabel>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        md={9}
        lg={6}
        spacing={3}
        style={{ marginTop: "1%" }}
      >
        <Grid item>
          <RIMAButton
            name={"Compare"}
            activeButton={CompareBtnactive}
            onClick={getPublicationsCounts}
          />
        </Grid>
        <Grid item>
          <RIMAButton
            name={"Reset"}
            activeButton={ResetBtnactive}
            onClick={() => {
              setSelectedEvents([]);
              setCompareBtnactive(false);
              setResetBtnactive(true);
            }}
          />
        </Grid>
        <Grid item>
          <i
            className="fas fa-question-circle text-blue"
            onMouseOver={() => handleToogle(true)}
            onMouseOut={() => handleToogle(false)}
            style={{
              marginLeft: "2%",
            }}
          />
          {imageTooltipOpen && (
            <InfoBox
              Info={"Each part in a bar represent a specific topic"}
            ></InfoBox>
          )}
        </Grid>
      </Grid>
      <br />
      <GroupBarChart options={options} series={series} loader={loader} />
      {publicationList && publicationList.length > 0 && (
        <PublicationDialog
          openDialogProps={openDialog}
          papersProps={publicationList}
          handleCloseDiaglog={handleCloseDiaglog}
          originalKeywordsProps={[selectedWord]}
        />
      )}
    </Grid>
  );
};

export default TopicPopularityOverYears;
