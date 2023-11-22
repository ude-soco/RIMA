import React from "react";
import {Card, CardContent, CircularProgress, Grid, makeStyles, Typography, paper} from "@material-ui/core";
import RecentInterest from "./RecentInterest/RecentInterest";
import Activities from "./Activities/Activities";
import PotentialInterests from "./PotentialInterests/PotentialInterests";
import InterestTrends from "./InterestsTrends/InterestTrends";
import InterestOverview from "./Tabs/InterestOverview";

const useStyles = makeStyles((theme) => ({
  spacing: {
    padding: theme.spacing(2),
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  padding: {
    margin: theme.spacing(15, 0, 15, 0),
  },
  paperContainer: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    margin: theme.spacing(2)
  }
}));

export default function InterestProfile() {
  const classes = useStyles();

  const loading = (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className={classes.padding}
    >
      <Grid item>
        <CircularProgress/>
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>
  );

  return (
  <>
    <Grid container direction="row" spacing={2}>
      <paper className={classes.paperContainer}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
                      Open interest profile:
          </Typography>
          <Typography gutterBottom>
              This represents the interests extracted from your papers and can be changed by you.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <InterestOverview/>
        </Grid>
      </paper>

      {/*<paper className={classes.paperContainer}>
        <Typography variant="h5" gutterBottom>
            Generated interest profile:
        </Typography>
        <Typography gutterBottom>
            This represents the interests extracted from your papers without any changes.
        </Typography>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={4}>
              <Card className={classes.cardHeight}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Recent Interests
                  </Typography>
                  <Typography gutterBottom>
                    This chart shows your recent interests in the last year (for
                    publications), and last month (for tweets).
                  </Typography>
                  <RecentInterest loading={loading} height={400}/>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={8}>
              <Card className={classes.cardHeight}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                      Activities: Publications and Tweets 
                  </Typography>
                    <Activities
                      classes={classes}
                      loading={loading}
                      showTitle={true}
                    />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <InterestTrends classes={classes} show={true} elevation={true}/>
            <InterestTrends classes={classes} show={true} elevation={true}/>
          </Grid>
        </Grid>
      </paper>*/}
        {/*
        <Grid item xs={12}>
          <PotentialInterests classes={classes} />
        </Grid>
        */}
    </Grid>
  </>
  );
}
