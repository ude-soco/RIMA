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
import { BASE_URL_CONFERENCE } from "Services/constants";
import { useEffect } from "react";

const PublicationWordCloud = ({ PublicationProp }) => {
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
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    getTopicOfPublication();
  }, []);

  useEffect(() => {
    getTopicOfPublication();
  }, [PublicationProp]);
  const getTopicOfPublication = async () => {
    setShowWarning(false);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationKeywords/" + PublicationProp.id
    );
    const response = await request.json();
    if (response.length === 0) {
      setShowWarning(true);
    }
    setSeries(response);

    console.log("word cloud sereis: ", response);
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
        <Grid item xs={12} marginBottom={"4%"}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
            marginBottom={"3%"}
          >
            Most popular topics in {PublicationProp.title}
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
            <Grid item justify="center" alignItems="center">
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => setImageTooltipOpen(true)}
                onMouseOut={() => setImageTooltipOpen(false)}
              >
                {imageTooltipOpen && (
                  <InfoBox
                    marginLeft={"50%"}
                    style={{
                      transform: "translateX(-50%)",
                    }}
                    Info={`By clicking on Topics icon in publication list,
                      the word cloud will be generated`}
                  />
                )}
              </i>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ padding: "1%", marginTop: "1%" }}>
        <Paper style={{ width: "100%", height: "450px", borderRadius: "40px" }}>
          <ReactWordcloud id="tpc_cloud" options={options} words={series} />
        </Paper>
      </Grid>
    </Grid>
  );
};
export default PublicationWordCloud;
