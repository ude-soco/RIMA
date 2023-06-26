import React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import "../assets/styles.css";
import KeywordCloud from "./KeywordCloud";
import TopSimilarityChart from "./TopSimilarityChart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "10px",
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

let activeTimeout = null;

/**
 * Display the Why explanation
 * @param {object} props Component props
 * @param {object} props.paper Paper object
 */
function WhyExplanation({ paper }) {
  const [activeChart, setActiveChart] = React.useState(null);

  const classes = useStyles();

  const onSelectedItem = (word, interests) => {
    if (activeChart?.word === word) return;
    // Clear previous task, if it didn't run during 300ms
    if (!!activeTimeout) {
      clearTimeout(activeTimeout);
    }
    //Set the task for Displaying or hidding the Bar chart after 300ms
    activeTimeout = setTimeout(() => {
      if (!interests) {
        setActiveChart(null);
      } else {
        try {
          setActiveChart({ word, interests });
        } catch (ex) {
          ex.message.toLowerCase();
        }
      }
    }, 300);
  };

  return (
    <Grid item md={12} className={classes.collapseButton} container spacing={2}>
      <Grid item xs={7}>
        <div style={{ width: "90%" }}>
          <KeywordCloud
            keywords={paper.keywords_similarity}
            onSelectedItem={onSelectedItem}
          />
        </div>
      </Grid>
      <Grid item xs={5}>
        {activeChart ? (
          <TopSimilarityChart
            interests={activeChart.interests}
            height={200}
            maxItem={100}
            title={"    "}
          />
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
}

export default WhyExplanation;
