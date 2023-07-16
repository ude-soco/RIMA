import {
  Grid,
  Typography,
  Paper,
  ListItem,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ReactWordcloud from "react-wordcloud";
import List from "@mui/material/List";
import InfoBox from "../ReuseableComponents/InfoBox";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import ArticleIcon from "@mui/icons-material/Article";
import { FixedSizeList } from "react-window";
import { BASE_URL_CONFERENCE } from "Services/constants";
import { useEffect } from "react";

export default function AuthorTopCitedPubs({
  authorNameProps,
  conferencesProps,
}) {
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [publications, setPublication] = useState([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
  ]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
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
  const [selectedWord, setSelectedWord] = useState("");
  const [loader, setLoader] = useState(false);

  const getPublicationWords = (publication) => {
    console.log("publicatins title: ", publication);
  };
  useEffect(() => {
    getAuthorPublications();
  }, []);
  useEffect(() => {
    getAuthorPublications();
  }, [authorNameProps]);
  const getAuthorPublications = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorPublications/" + authorNameProps.label
    );
    const response = await request.json();
    setPublication(response);
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
      <Grid item xs={12} lg={6}>
        <Grid container xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            All {authorNameProps.name}'s Publications published in{" "}
            {conferencesProps.join(", ")}
          </Typography>
          <Grid container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6">
                This list contains all of {authorNameProps.name}'s publications
                that have been published in {conferencesProps.join(", ")}{" "}
                conferences. Publications are ordered in descending order based
                on the number of citations they have received, highlighting
                those with the greatest academic impact at the top of the list.
              </Typography>

              <Grid item justify="center" alignItems="center">
                <i
                  className="fas fa-question-circle text-blue"
                  onMouseOver={() => setImageTooltipOpen(true)}
                  onMouseOut={() => setImageTooltipOpen(false)}
                >
                  {imageTooltipOpen && (
                    <InfoBox
                      marginLeft={"0%"}
                      style={{
                        transform: "translateX(-50%)",
                      }}
                      Info={`By clicking on artical icon, detailed information about the 
                         publication will be shown`}
                    />
                  )}
                </i>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}>
            <Paper
              style={{ width: "100%", borderRadius: "40px", padding: "5%" }}
            >
              <Grid item xs={12} style={{ marginBottom: "0%", margin: "2%" }}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  onChange={handleSearch}
                />
                <List
                  sx={{
                    width: "100%",

                    bgcolor: "background.paper",
                    maxHeight: 300,
                    position: "relative",
                    overflow: "auto",
                  }}
                >
                  {publications.map((value) => (
                    <ListItem
                      key={value}
                      disableGutters
                      secondaryAction={
                        <div>
                          <IconButton
                            aria-label="comment"
                            onClick={() => getPublicationWords(value)}
                          >
                            <ArticleIcon />
                          </IconButton>
                          <IconButton
                            aria-label="comment"
                            onClick={() => getPublicationWords(value)}
                          >
                            <Typography>Topics</Typography>
                          </IconButton>
                        </div>
                      }
                    >
                      <ListItemText
                        primary={
                          <Grid item xs={10}>
                            <Typography>{`${value}`}</Typography>
                          </Grid>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Grid container xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            All {authorNameProps.name}'s Publications published in{" "}
            {conferencesProps.join(", ")}
          </Typography>
          <Grid container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h6">
                This list contains all of {authorNameProps.name}'s publications
                that have been published in {conferencesProps.join(", ")}{" "}
                conferences. Publications are ordered in descending order based
                on the number of citations they have received, highlighting
                those with the greatest academic impact at the top of the list.
              </Typography>

              <Grid item justify="center" alignItems="center">
                <i
                  className="fas fa-question-circle text-blue"
                  onMouseOver={() => setImageTooltipOpen(true)}
                  onMouseOut={() => setImageTooltipOpen(false)}
                >
                  {imageTooltipOpen && (
                    <InfoBox
                      marginLeft={"0%"}
                      style={{
                        transform: "translateX(-50%)",
                      }}
                      Info={`By clicking on artical icon, detailed information about the 
                         publication will be shown`}
                    />
                  )}
                </i>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
          <Paper
            style={{ width: "100%", height: "450px", borderRadius: "40px" }}
          >
            <ReactWordcloud id="tpc_cloud" options={options} words={series} />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
