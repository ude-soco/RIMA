import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import InterestOverview from "./InterestOverview/InterestOverview";
import RecentInterest from "./RecentInterest/RecentInterest";
import Activities from "./Activities/Activities";

const useStyles = makeStyles(theme => ({
  spacing: {
    padding: theme.spacing(4)
  },
  cardHeight: {
    height: "100%",
    width: "100%"
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

        <Grid item>
          <Grid container spacing={2} >
            <Grid item lg={4} >
              <RecentInterest classes={classes}/>
            </Grid>

            <Activities classes={classes}/>
          </Grid>
        </Grid>

      </Grid>

    </>
  );
}
