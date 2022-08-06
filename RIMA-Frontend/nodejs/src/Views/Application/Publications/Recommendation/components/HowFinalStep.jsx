import React from "react";
import { Paper, Grid, Hidden, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Flowchart from "./Flowchart";
import { getFinalElement } from "./FlowChartUtil";
import ReactTooltip from "react-tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const useStyles = makeStyles((theme) => ({
  paperCustom: {
    padding: "1rem",
    fontFamily: "roboto",
    margin: "0.2rem",
  },
  typographyCustom: {
    padding: "15px 0px",
    textAlign: "center",
    "& span": {
      fontSize: "1.2rem",
    },
  },
  dividerCustom: {
    marginTop: "2rem",
  },
  itemBox: {
    margin: 0,
    padding: 10,
  },
  tooltipText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
}));

/**
 * Display the Compute the similarity step of the How explanation
 * @param {object} props Component props
 * @param {object} props.paper Paper object
 */
export default function HowFinalStep({ paper }) {
  const classes = useStyles();
  const finalScore = getFinalElement(
    "Interest",
    "INTEREST MODEL EMBEDDING",
    "Publication",
    "PUBLICATION EMBEDDING",
    "COSINE SIMILARITY",
    "SIMILARITY SCORE:" + paper.score + "%"
  );
  return (
    <Paper className={classes.paperCustom} elevation={0}>
      <Grid container direction="row" justify="space-between">
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          lg={8}
          xl={6}
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          style={{ maxHeight: "350px", height: "350px" }}
        >
          <Flowchart
            keyChart={"final"}
            elements={finalScore}
            height={400}
            xStartPoint={0}
            yStartPoint={0}
          />
        </Grid>
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
      </Grid>
    </Paper>
  );
}
