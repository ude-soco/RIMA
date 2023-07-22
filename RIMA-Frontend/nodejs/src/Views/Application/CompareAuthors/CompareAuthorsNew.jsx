import { Grid, Paper } from "@mui/material";
import { makeStyles } from "@material-ui/core";

import React from "react";
import CompareAuthorsStackedBarChart from "./ComparingAuthorsPublicationsBased";
import CompareAuthorTotalCitation from "./CompareAuhtorsTotalCitation";
import CoauthorEvolution from "./CoauthorEvolution";
import SharedInterestsBetweenAuthors from "../AuthorInsights/SharedInterestsBetweenAuthors";
import AuthorsProductivityOverTime from "./AuthorsProductivityOverTime";

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  gutter: {
    marginBottom: theme.spacing(2),
  },
  gutterLarge: {
    marginBottom: theme.spacing(11),
  },
  tabPanel: {
    marginBottom: theme.spacing(7),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  header: {
    marginBottom: theme.spacing(8),
  },
  headerAlt: {
    margin: theme.spacing(3, 0, 4, 0),
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    marginBottom: 24,
  },
  cardHeightAlt: {
    height: "100%",
    padding: theme.spacing(4, 4, 0, 4),
    // borderRadius: theme.spacing(4, 4, 0, 0),
    borderRadius: theme.spacing(2),
    marginBottom: 24,
  },
}));
const CompareAuthorsNew = () => {
  const classes = useStyles();

  return (
    <>
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs={12}>
          <CompareAuthorsStackedBarChart />
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs={12}>
          <AuthorsProductivityOverTime />
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs={12}>
          <CoauthorEvolution />
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs={12}>
          <SharedInterestsBetweenAuthors />
        </Grid>
      </Grid>
    </>
  );
};
export default CompareAuthorsNew;
