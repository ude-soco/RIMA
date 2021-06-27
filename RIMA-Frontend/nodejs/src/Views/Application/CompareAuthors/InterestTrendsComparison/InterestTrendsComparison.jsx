import React from 'react';
import {getUserInfo} from "../../../../Services/utils/functions";
import {Divider, Grid, Typography} from "@material-ui/core";
import InterestTrends from "../../InterestProfile/InterestsTrends/InterestTrends";

export default function InterestTrendsComparison({classes, compareAuthor}) {
  const currentUser = getUserInfo();

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Evolution of Interests </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>

      <Grid container className={classes.gutter}>
        <Grid item xs={12} lg={6}>
          <Grid container direction="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              {currentUser.first_name} {currentUser.last_name}
            </Typography>
            <Grid container>
              <InterestTrends classes={classes} elevation={false}/>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container direction="column" alignItems="center">

            <Typography variant="h5" color="textSecondary">
              {compareAuthor.first_name} {compareAuthor.last_name}
            </Typography>
            <Grid container>
              <InterestTrends classes={classes} user={compareAuthor} show={false} elevation={false}/>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
