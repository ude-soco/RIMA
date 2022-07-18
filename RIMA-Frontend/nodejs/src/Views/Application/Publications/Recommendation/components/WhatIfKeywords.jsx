/**
 * WhatIfKeywords.jsx - The component of What-if keywords explanation
 * User can change the publication's extracted keywords
 * the simple bar chart explains the similarty between keywords and interest model
 * contains:
 * 1. the box of exteracted keywords: (included in calculations)
 * 2. the box of potential keywords : (excluded from calculations)
 * 3. threshold slider
 * 4. simple bar chart
 * 5. compareble bar chart for similarity score
 */
import React, { useEffect, useState } from "react";
import {
  Grid,
  Chip,
  makeStyles,
  Typography,
  Paper,
  Button,
  Slider,
  Divider,
} from "@material-ui/core";
import RestAPI from "Services/api";
import { BarChart } from "./BarChartKeywords";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SyncAltOutlinedIcon from "@material-ui/icons/SyncAltOutlined";
import blueGrey from "@material-ui/core/colors/blueGrey";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 24,
  },
  chipList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  chipAdded: {
    backgroundColor: blueGrey[500],
  },
}));
/**
 * @function WhatIfKeywords
 * What-if keywords explanation
 * @param {Object} props paper(Object), interests(Object), index(String), threshold(Number)
 * @returns The component of What-if keywords explanation
 */
export const WhatIfKeywords = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    paper: props.paper,
    keywords: Object.entries(props.paper.paper_keywords),
    potentialKeywords: Object.entries(props.paper.extra_keywords),
    interests: props.interests,
    index: props.index,
    threshold: props.threshold,
  });

  useEffect(() => {
    handleKeywordsChangeChip();
  }, [state.keywords.length]);

  //Methods:
  /**
   * To apply the changes
   */
  const handleApplyKeywordsChanges = () => {
    const newPaperProps = state.paper;
    newPaperProps.score = state.paper.new_score;
    newPaperProps.keywords_relevancy = state.paper.keywords_relevancy;
    newPaperProps.interests_similarity = state.paper.new_interests_similarity;
    newPaperProps.paper_keywords = state.keywords.reduce(
      (a, v) => ({ ...a, [v[0]]: v[1] }),
      {}
    );
    newPaperProps.threshold = state.threshold;
    newPaperProps.modified = true;
    setState({
      ...state,
      paper: newPaperProps,
    });
    props.handleApplyWhatIfChanges(state.index, newPaperProps);
  };

  /**
   * To remove a keyword from the publication keyword list and
   * to add it in the potential list
   * @param {String} keywordToDelete
   * @returns
   */
  const handleDeleteFromList = (keywordToDelete) => () => {
    const keywords = state.keywords.filter((chip) => chip !== keywordToDelete);
    state.potentialKeywords.push(keywordToDelete);
    setState({ ...state, keywords });
  };

  /**
   * To remove a keyword from  and the potential list
   * to add it in the publication keyword list
   * @param {String} selectedKeyword
   * @returns
   */
  const handleAddToList = (selectedKeyword) => () => {
    const potentialKeywords = state.potentialKeywords.filter(
      (keyword) => keyword !== selectedKeyword
    );
    state.keywords.push(selectedKeyword);
    setState({ ...state, potentialKeywords });
  };

  /**
   * To get the calculations after changing
   */
  const handleKeywordsChangeChip = () => {
    const params = {
      interests: state.interests,
      keywords: state.keywords.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {}),
    };

    const paper = state.paper;
    RestAPI.getKeywordsSimilarities(params)
      .then((res) => {
        paper.new_score = res.data.data.score;
        paper.keywords_relevancy = res.data.data.keywords_similarity;
        setState({
          ...state,
          paper: paper,
        });
      })
      .catch((err) => console.error("Error Getting Papers:", err));
  };
  /**
   * To change the threshold
   * @param {event} event
   * @param {Int} threshold
   */
  const handleChangeThreshold = (event, threshold) => {
    if (typeof threshold === "number") {
      setState({ ...state, threshold });
    }
  };

  /**
   * To display the threshold value with percent
   * @param {Int} value
   * @returns
   */
  const valueLabelFormat = (value) => {
    let scaledValue = value;
    return `${scaledValue}%`;
  };

  return (
    <Grid container className={classes.root}>
      <Grid container alignItems="center">
        <Grid item md={5}>
          <Typography style={{ marginBottom: "10px" }}>
            Exteracted Keywords:
            <Typography variant="caption">
              {" "}
              (Included in calculations)
            </Typography>
          </Typography>

          <Paper className={classes.chipList}>
            {state.keywords.map((data) => {
              return (
                <Chip
                  label={data[0]}
                  onDelete={handleDeleteFromList(data)}
                  className={`${classes.chip} ${classes.chipAdded}`}
                  color="primary"
                />
              );
            })}
          </Paper>
        </Grid>
        <Grid item md={2} style={{ textAlign: "center" }}>
          <SyncAltOutlinedIcon style={{ fontSize: "5.5rem", color: "#ccc" }} />
        </Grid>
        <Grid item md={5} style={{ height: "100%" }}>
          <Typography style={{ marginBottom: "10px" }}>
            More Keywords:
            <Typography variant="caption">
              {" "}
              (Excluded from calculations)
            </Typography>
          </Typography>
          <Paper className={classes.chipList} id="potential">
            {state.potentialKeywords.map((data, i) => {
              return (
                <Chip
                  key={i}
                  label={data[0]}
                  onDelete={handleAddToList(data)}
                  className={classes.chip}
                  deleteIcon={<AddCircleIcon />}
                />
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      <Divider style={{ width: "100%", marginTop: "10px" }} />
      <Grid container style={{ justifyContent: "center", marginTop: "40px" }}>
        <Grid item md={3}>
          <span>Similarity Threshold:</span>
        </Grid>
        <Grid container spacing={2} alignItems="center" item md={9}>
          <Grid item>0%</Grid>
          <Grid item xs>
            <Slider
              md={6}
              value={state.threshold}
              defaultValue={state.threshold}
              min={0}
              step={5}
              max={100}
              marks
              getAriaValueText={valueLabelFormat}
              valueLabelFormat={valueLabelFormat}
              onChange={handleChangeThreshold}
              valueLabelDisplay="on"
            />
          </Grid>
          <Grid item>100%</Grid>
        </Grid>
      </Grid>
      <Divider style={{ width: "100%", marginTop: "10px" }} />

      <Grid item container md={12}>
        <BarChart
          paper={state.paper}
          interests={state.interests}
          threshold={state.threshold}
        />
      </Grid>
      <Grid container justify="flex-end" style={{ padding: 10 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleApplyKeywordsChanges}
        >
          Apply changes
        </Button>
      </Grid>
    </Grid>
  );
};
