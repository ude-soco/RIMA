import React from "react";
import {Card, CardContent, CircularProgress, Grid, makeStyles, Typography} from "@material-ui/core";
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
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2)
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
              <Card className={classes.cardHeight}>
                <CardContent>
                  <Typography variant="h5" gutterBottom> Recent Interests </Typography>
                  <Typography gutterBottom>
                    This chart shows your recent interests in the last year (for publications), and last month (for
                    tweets).
                  </Typography>
                  <RecentInterest loading={loading} height={400}/>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Activities classes={classes} loading={loading} showTitle={true} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>

            {/*<InterestTrends classes={classes} show={true} elevation={true}/>*/}
            <InterestTrends classes={classes} show={true} elevation={true}/>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <PotentialInterests classes={classes}/>
        </Grid>

      </Grid>
    </>
  );
}
