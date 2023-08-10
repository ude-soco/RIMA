// created by Islam Abdelghaffar

import { Grid, Typography, Paper, IconButton } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import ReactWordcloud from "react-wordcloud";
import { BASE_URL_CONFERENCE } from "Services/constants";
import { useEffect } from "react";
import RIMAAutoComplete from "./RIMAAutoComplete";
import ArticleIcon from "@mui/icons-material/Article";
import PublicationDialog from "../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

const PublicationWordCloud = ({ authorNameProps, conferencesProps }) => {
  const [openDialog, setOpenDialog] = useState(false);

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
    { text: "learning activity design", value: 0.9270649279070103 },
    { text: "learning activity design", value: 0.9270649279070103 },
  ]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [publicationList, setPublicationList] = useState([]);

  const [publications, setPublications] = useState([
    { title: "publication 1", id: "1" },
    { title: "publication 2", id: "2" },
    { title: "publication 3", id: "3" },
  ]);
  const [selectedPublication, setSelectedPublication] = useState({});

  useEffect(() => {
    getAuthorPublications();
  }, []);
  useEffect(() => {
    getAuthorPublications();
  }, [authorNameProps]);
  useEffect(() => {
    getTopicOfPublication();
  }, [selectedPublication]);

  const getTopicOfPublication = async () => {
    if (!selectedPublication) {
      return;
    }
    setShowWarning(false);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationKeywords/" + selectedPublication.id
    );
    const response = await request.json();
    if (response.length === 0) {
      setShowWarning(true);
    }
    setSeries(response);
  };
  const getSelectedPublication = async () => {
    if (!selectedPublication) {
      return;
    }
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationByID/" + selectedPublication.id
    );
    const response = await request.json();
    setPublicationList(response.publicationList);
    setOpenDialog(true);
  };
  const getAuthorPublications = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorPublications/" + authorNameProps.label
    );
    const response = await request.json();
    setPublications(response);
  };
  const HandleSelectedPublication = (pubication) => {
    setSelectedPublication(pubication);
  };
  const handleCloseDiaglog = () => {
    setOpenDialog(false);
  };
  return (
    <Grid
      container
      style={{
        padding: "2%",
        margin: "1%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Grid container xs={12} marginBottom={"6%"}>
        <Grid item xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            Most popular topics in{" "}
            {selectedPublication && selectedPublication.title}
          </Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}>
            <Typography variant="h6">
              The word cloud illustrates the most popular topics in the selected
              publication based on their occurrence and influence. Each word in
              the cloud represents a topic, and the size of the word corresponds
              to its significance. Larger words indicate topics of greater
              importance or influence.
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            This list contains all of{" "}
            <b>
              {authorNameProps.name}'s publications that have been published in
              ({conferencesProps.join(", ")}) conferences
            </b>
            .<b> Publications</b> are ordered in descending order based on the
            number of citations they have received, highlighting those{" "}
            <b>with the greatest academic impact at the top of the list</b>.
          </Typography>
        </Grid>
        <Grid container>
          <Grid xs={8}>
            <RIMAAutoComplete
              PublicationsProps={publications}
              setvalueProps={HandleSelectedPublication}
            />
          </Grid>
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={2}>
                <IconButton
                  aria-label="comment"
                  onClick={() => {
                    getSelectedPublication();
                  }}
                >
                  <ArticleIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {showWarning && (
        <Typography
          style={{ fontWeight: "bold", color: "#BC211D" }}
          variant="h6"
          gutterBottom
          marginBottom={"3%"}
        >
          {" "}
          No topics available for this publication
        </Typography>
      )}
      <Grid container xs={12} style={{ padding: "1%" }}>
        <Paper style={{ width: "100%", height: "450px", borderRadius: "40px" }}>
          <ReactWordcloud id="tpc_cloud" options={options} words={series} />
        </Paper>
      </Grid>
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
export default PublicationWordCloud;
