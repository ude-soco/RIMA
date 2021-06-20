import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";

export default function BasicExplanation({classes, similarityScores, compareAuthor}) {

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Basic Explanation: Semantic-based similarity of users’ interest models</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>
    </>
  );
}
