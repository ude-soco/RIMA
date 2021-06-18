import React from 'react';
import {getUserInfo} from "../../../../Services/utils/functions";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import InterestTrends from "../../InterestProfile/InterestsTrends/InterestTrends";

export default function InterestTrendsComparison({classes, compareAuthor}) {
  const currentUser = getUserInfo();

  return (
    <Card className={classes.cardHeight}>
      <CardContent>
        <Grid container justify="center" className={classes.gutterLarge}>
          <Grid item>
            <Typography variant="h5" >
              <b> Interest Trends </b>
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="h5">
                {currentUser.first_name} {currentUser.last_name}
              </Typography>

              <InterestTrends classes={classes} elevation={false}/>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column" alignItems="center">

              <Typography variant="h5">
                {compareAuthor.first_name} {compareAuthor.last_name}
              </Typography>

              <InterestTrends classes={classes} user={compareAuthor} show={false} elevation={false}/>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}