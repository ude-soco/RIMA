import React, { useState } from "react";
import {
  Button as ButtonMUI,
  Collapse,
  Grid,
  makeStyles,
  Typography,
  CssBaseline,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SettingsIcon from "@material-ui/icons/Settings";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import Flowchart from "../Components/Flowchart";
import Seperator from "./Seperator";
// import ReplaceableCloudChart from "../Components/ReplaceableCloudChart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  collapse: {
    backgroundColor: theme.palette.common.white,
  },
  collapseButton: {
    margin: "10px",
    display: "flex",
    justifyContent: "flex-end",
  },
  center: {
    display: "flex",
    justifyContent: "center ",
  },
}));

export default function ExpansionPanel(props) {
  // Tannaz start
  const [whyShow, setWhyShow] = useState(false);
  const [whatIfShow, setWhatIfShow] = useState(false);
  const [moreDetail, setMoreDetail] = useState(false);

  var moreDetailFlowchart = [
    // nodes
    {
      data: {
        id: "one",
        label: "Interest Model",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 3, y: 30 },
    },
    {
      data: {
        id: "two",
        label: "Semantic Scholar API",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 215, y: 30 },
    },
    {
      data: {
        id: "three",
        label: "Interests",
        faveColor: "#3385ff",
        shape: "diamond",
        width: 110,
      },
      position: { x: -100, y: 110 },
    },
    {
      data: {
        id: "four",
        label: "Split Keyphrase into Keywords",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 200,
      },
      position: { x: 110, y: 110 },
    },
    {
      data: {
        id: "five",
        label: "Keywords",
        faveColor: "#3385ff",
        shape: "diamond",
        width: 110,
      },
      position: { x: 330, y: 110 },
    },
    {
      data: {
        id: "six",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: -105, y: 190 },
    },
    {
      data: {
        id: "seven",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 30, y: 190 },
    },
    {
      data: {
        id: "eight",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 190, y: 190 },
    },
    {
      data: {
        id: "nine",
        label: "Word Embedding",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 320, y: 190 },
    },
    {
      data: {
        id: "ten",
        label: "Interest Embeddings",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 130,
      },
      position: { x: -20, y: 260 },
    },
    {
      data: {
        id: "eleven",
        label: "Publication Keyword Embeddings",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 210,
      },
      position: { x: 250, y: 260 },
    },
    {
      data: {
        id: "twelve",
        label: "Cosine Similarity",
        faveColor: "#002966",
        shape: "round-rectangle",
        width: 120,
      },
      position: { x: 110, y: 350 },
    },
    // edges
    { data: { source: "one", target: "three", label: "Weighted Interests" } },
    { data: { source: "two", target: "five", label: "Weighted Interests" } },
    { data: { source: "three", target: "four", label: "No" } },
    { data: { source: "three", target: "six", label: "Yes" } },
    { data: { source: "five", target: "four", label: "No" } },
    { data: { source: "five", target: "nine", label: "Yes" } },
    { data: { source: "four", target: "seven", label: "Keyword" } },
    { data: { source: "four", target: "eight", label: "Keyword" } },
    { data: { source: "six", target: "ten", label: "Interest Embedding" } },
    { data: { source: "seven", target: "ten", label: "Interest Embeddings" } },
    {
      data: { source: "eight", target: "eleven", label: "Keyword Embeddings" },
    },
    { data: { source: "nine", target: "eleven", label: "Keyword Embedding" } },
    {
      data: {
        source: "ten",
        target: "twelve",
        label: "Weighted avg of all Interest Embeddings",
      },
    },
    {
      data: {
        source: "eleven",
        target: "twelve",
        label: "Weighted avg of all publication Keyword Embeddings",
      },
    },
  ];
  var lessDetailFlowchart = [
    // nodes
    {
      data: {
        id: "one",
        label: "Interest Model",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 50 },
    },
    {
      data: {
        id: "two",
        label: "Semantic Scholar API",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 50 },
    },
    {
      data: {
        id: "three",
        label: "Interests",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 150 },
    },
    {
      data: {
        id: "four",
        label: "Keywords",
        faveColor: "#3385ff",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 150 },
    },
    {
      data: {
        id: "five",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 10, y: 250 },
    },
    {
      data: {
        id: "six",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 210, y: 250 },
    },
    {
      data: {
        id: "seven",
        label: "Cosine Similarity",
        faveColor: "#002966",
        shape: "round-rectangle",
        width: 150,
      },
      position: { x: 110, y: 350 },
    },
    // edges
    { data: { source: "one", target: "three", label: "" } },
    { data: { source: "two", target: "four", label: "" } },
    { data: { source: "three", target: "five", label: "" } },
    { data: { source: "four", target: "six", label: "" } },
    { data: { source: "six", target: "seven", label: "" } },
    { data: { source: "five", target: "seven", label: "" } },
  ];

  const classes = useStyles();
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [whatIfExpanded, setWhatIfExpanded] = useState(false);
  const [howExpanded, setHowExpanded] = useState(false);

  const handleWhyExpandClick = () => {
    setWhyExpanded(!whyExpanded);
    setWhatIfExpanded(false);
    // Back Button:
    setWhyShow(!whyShow);
    setWhatIfShow(false);
  };
  const handleWhatIfExpandClick = () => {
    setWhatIfExpanded(!whatIfExpanded);
    setWhyExpanded(false);
    // Back Button:
    setWhatIfShow(!whatIfShow);
    setWhyShow(false);
  };

  // Tannaz end

  return (
    // Tannaz start
    <>
      <CssBaseline />

      <Grid container spacing={2} className={classes.collapseButton}>
        <Grid md={1}>
          <ButtonMUI
            variant="string"
            onClick={() => {
              handleWhyExpandClick();
            }}
          >
            Why?
          </ButtonMUI>
        </Grid>
        <Grid md={2}>
          <ButtonMUI
            variant="string"
            onClick={() => {
              handleWhatIfExpandClick();
            }}
          >
            What-If?
          </ButtonMUI>
        </Grid>
      </Grid>

      {/* Handling th Back button */}

      <Collapse in={whyExpanded} className={classes.collapse}>
        {whyShow && (
          <div className="d-flex justify-content-start ">
            <ButtonMUI
              variant="string"
              onClick={() => {
                setWhyShow(false);
                setWhyExpanded(!whyExpanded);
              }}
            >
              <ArrowBackIosIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2">
                Back
              </Typography>
            </ButtonMUI>
          </div>
        )}

        {/* Why visualizations */}
        <Grid container className={classes.root} spacing={2}>
          <Seperator Label="Why this publication?" Width="170" />

          <Grid item md={12} className={classes.collapseButton}>
            <ButtonMUI
              variant="string"
              size="small"
              className="m-2 mr-4"
              onClick={() => {
                setHowExpanded(!howExpanded);
              }}
            >
              <SettingsIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2" className="ml-1">
                How?
              </Typography>
            </ButtonMUI>{" "}
          </Grid>

          <Grid item md={8}>
            <div style={{ width: "90%" }}>
              Wordcloud
              {/* <ReplaceableCloudChart tags={props}/> */}
            </div>
          </Grid>
          <Grid item md={4}>
            Barchart
          </Grid>
        </Grid>

        {/* How Visualizations */}
        <Collapse in={howExpanded} className={classes.collapse}>
          <Grid container className={classes.root} spacing={0}>
            <Seperator Label="How the system works?" Width="200" />
            <Grid item md={12} className={classes.collapseButton}>
              {!moreDetail ? (
                <ButtonMUI
                  variant="string"
                  size="small"
                  className="m-2 mr-4"
                  onClick={() => {
                    setMoreDetail(true);
                  }}
                >
                  <AddCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    More
                  </Typography>
                </ButtonMUI>
              ) : (
                <ButtonMUI
                  variant="string"
                  size="small"
                  className="m-2 mr-4"
                  onClick={() => {
                    setMoreDetail(false);
                  }}
                >
                  <RemoveCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    Less
                  </Typography>
                </ButtonMUI>
              )}
            </Grid>
            {/* Left Category Buttons */}
            <Grid item md={4} sm={12} className="mr-0 pr-0">
              <div class="table-responsive-sm">
                <table class="table">
                  <tbody>
                    <tr class="box">
                      <td class="box-item interestsBox">
                        <Typography
                          align="left"
                          variant="subtitle2"
                          className="arrowBox"
                        >
                          Interests
                          <br />
                          Keywords
                        </Typography>
                      </td>
                    </tr>
                    <tr class="box">
                      <td class="box-item dataBox">
                        <Typography
                          align="left"
                          variant="subtitle2"
                          className="arrowBox"
                        >
                          Data
                          <br />
                          Preprocess
                        </Typography>
                      </td>
                    </tr>
                    <tr class="box ">
                      <td class="box-item embeddingsBox">
                        <Typography
                          align="left"
                          variant="subtitle2"
                          className="arrowBox"
                        >
                          Embeddings
                          <br />
                          Generation
                        </Typography>
                      </td>
                    </tr>
                    <tr class="box">
                      <td class="box-item similarityBox">
                        <Typography
                          align="left"
                          variant="subtitle2"
                          className="arrowBox"
                        >
                          Similarity
                          <br />
                          Calculation
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Grid>
            {/* Right Flowchart */}
            <Grid item md={8} sm={12} className="ml-0 pl-0">
              {!moreDetail ? (
                <Flowchart elements={lessDetailFlowchart} />
              ) : (
                <Flowchart elements={moreDetailFlowchart} />
              )}
            </Grid>
          </Grid>
        </Collapse>
      </Collapse>

      <Collapse in={whatIfExpanded} className={classes.collapse}>
        {whatIfShow && (
          <div className="d-flex justify-content-start ">
            <ButtonMUI
              variant="string"
              onClick={() => {
                setWhatIfShow(false);
                setWhatIfExpanded(!whatIfExpanded);
              }}
            >
              <ArrowBackIosIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2">
                Back
              </Typography>
            </ButtonMUI>
          </div>
        )}
        <Grid container className={classes.root} spacing={2}>
          {/* What-if visualization */}

          <Seperator Label="What-if I change?" Width="170" />
          <div>----- Visualizations What-if?</div>
        </Grid>
      </Collapse>
    </>

    // Tannaz end
  );
}
