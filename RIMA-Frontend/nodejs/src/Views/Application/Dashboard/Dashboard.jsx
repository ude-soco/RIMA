import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import InterestOverview from "./InterestOverview/InterestOverview";
import RecentInterest from "./RecentInterest/RecentInterest";

const useStyles = makeStyles(theme => ({
  spacing: {
    padding: theme.spacing(4)
  }
}))

export default function Dashboard() {
  const classes = useStyles();

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <InterestOverview classes={classes}/>
        </Grid>

        <Grid item xs={4}>
          <RecentInterest classes={classes}/>
        </Grid>

      </Grid>

    </>
  );
}
