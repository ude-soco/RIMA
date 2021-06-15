import React from "react";
import {CircularProgress, Grid, makeStyles, Typography} from "@material-ui/core";
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
  },
  padding: {
    margin: theme.spacing(15, 0, 15, 0)
  }
}))

export default function InterestProfile() {
  const classes = useStyles();

  const loading =
    <Grid container direction="column" justify="center" alignItems="center" className={classes.padding}>
      <Grid item>
        <CircularProgress/>
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>


  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={12}>
          <InterestOverview classes={classes}/>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <RecentInterest classes={classes} loading={loading}/>
            </Grid>

            <Activities classes={classes}/>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <InterestTrends classes={classes} />
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <PotentialInterests/>
        </Grid>

      </Grid>

    </>
  );
}
