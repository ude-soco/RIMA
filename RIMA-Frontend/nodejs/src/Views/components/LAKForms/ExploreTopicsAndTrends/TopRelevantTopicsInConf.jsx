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
import ReactWordcloud from "react-wordcloud";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";
import PublicationDialog from "../../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

const TopRelevantTopicsInConf = ({ selectedConferenceProps, confEvents }) => {
  const [series, setSeries] = useState([
    { text: "self-regulated learning", value: 0.9336746872423364 },
    {
      text: "interpretive quantitative investigations",
      value: 0.9335914980975198,
    },
    { text: "online learning networks", value: 0.9299806164887323 },
    {
      text: "chat logs multi-user virtual environments",
      value: 0.9272829146020187,
    },
    { text: "learning activity design", value: 0.9270649279070103 },
  ]);
  const options = {
    colors: ["#b39ddb", "#7e57c2", "#4fc3f7", "#03a9f4", "#0288d1", "#01579b"],
    enableTooltip: true,
    deterministic: true,
    fontFamily: "helvetica",
    fontSizes: [14, 64],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 3,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000,
  };

  const [selectedConference, setSelectedConference] = useState(
    selectedConferenceProps
  );

  const [selectedEvent, setSelectedEvent] = useState("");
  const [CompareBtnactive, setCompareBtnactive] = useState(false);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [numerOfTopics, setNumberOfTopics] = useState([5, 10, 15, 20]);
  const [selectedNumber, setSelectedNumber] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  useEffect(() => {
    setSelectedConference(selectedConferenceProps);
  }, [selectedConferenceProps]);

  useEffect(() => {
    const getPubs = async () => {
      await getPublicationsCounts();
    };
    getPubs();
  }, [selectedConference]);

  const getPublicationsCounts = async () => {
    if (selectedEvent == "") {
      return;
    }
    setLoader(true);
    setCompareBtnactive(true);
    let request = await fetch(
      `${BASE_URL_CONFERENCE}` +
        "wordcloud/keyword/" +
        selectedNumber +
        "/" +
        selectedEvent
    );
    const response = await request.json();
    console.log("response", response);
    setSeries(response.words);
  };

  useEffect(() => {
    getPublicationList();
  }, [selectedWord]);

  const getPublicationList = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getRelaventPublicationsList/" +
        selectedEvent +
        "&" +
        "keyword" +
        "&" +
        selectedWord
    );
    const response = await request.json();
    console.log("response00: ", response["publicationList"]);
    setPublicationList(response["publicationList"]);
    setOpenDiaglog(true);
  };
  useEffect(() => {
    if (loader == true) {
      setLoader(false);
    }
  }, [series]);
  const handleToogle = (status) => {
    setImageTooltipOpen(status);
  };

  const callbacks = {
    onWordClick: (word) => setSelectedWord(word.text),
    getWordTooltip: (word) => `click to view details`,
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
          Top Relevant Topics in Conference Publications
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography style={{ paddingTop: "1%" }}>
          Identifying the Most Relevant Topics in Conference Publications Based
          on Occurrence and Influence Scores
        </Typography>
      </Grid>
      <Grid container xs={12} style={{ paddingTop: "1%" }}>
        <Grid item xs={12}>
          <Grid item xs={12} md={5}>
            <FormControl
              sx={{ m: 1, minWidth: "100%", backgroundColor: "white" }}
            >
              <InputLabel>Select an Event*</InputLabel>
              <Select
                labelId="First Event"
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                }}
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
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} md={8} spacing={3} style={{ marginTop: "1%" }}>
        <Grid item md={2} xs={3}>
          <RIMAButton
            name={"Topics"}
            activeButton={CompareBtnactive}
            onClick={getPublicationsCounts}
          />
        </Grid>
        <Grid item lg={1} md={2} xs={3}>
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
              Info={`The size of each word corresponds to its weight or significance.
             Larger words indicate topics of greater importance or influence. `}
            ></InfoBox>
          )}
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
        <ActiveLoader height={50} width={50} visible={loader} />
        <Paper style={{ width: "100%", borderRadius: "40px" }}>
          <ReactWordcloud
            id="tpc_cloud"
            callbacks={callbacks}
            options={options}
            words={series}
          />
        </Paper>
        {publicationList && publicationList.length > 0 && (
          <PublicationDialog
            openDialogProps={openDialog}
            papersProps={publicationList}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TopRelevantTopicsInConf;
