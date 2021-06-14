import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import InterestOverview from "./InterestOverview/InterestOverview";
import RecentInterest from "./RecentInterest/RecentInterest";
import Activities from "./Activities/Activities";
import PotentialInterests from "./PotentialInterests/PotentialInterests";
import InterestTrends from "./InterestsTrends/InterestTrends";

const useStyles = makeStyles(theme => ({
  spacing: {
    padding: theme.spacing(2)
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(2)
  }
}))

export default function InterestProfile() {
  const classes = useStyles();

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <InterestOverview classes={classes}/>
        </Grid>

        <Grid item>
          <Grid container spacing={2}>
            <Grid item lg={4}>
              <RecentInterest classes={classes}/>
            </Grid>

            <Activities classes={classes}/>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2}>
            <InterestTrends classes={classes}/>
          </Grid>
        </Grid>

        <Grid item lg={8}>
          <PotentialInterests/>
        </Grid>

      </Grid>

    </>
  );
}
