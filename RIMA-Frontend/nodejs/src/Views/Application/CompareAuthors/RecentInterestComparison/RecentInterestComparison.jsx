import React from "react";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import RecentInterest from "../../InterestProfile/RecentInterest/RecentInterest";


export default function RecentInterestComparison({classes, loading, currentUser, compareAuthor}) {

  return (
    <Card className={classes.cardHeight}>
      <CardContent>
        <Grid container justify="center">
          <Grid item>
            <Typography variant="h5">
              <b> Recent Interests </b>
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={6}>
            <Grid container direction="column" alignItems="center">
              <Typography variant="h5">
                {currentUser.first_name} {currentUser.last_name}
              </Typography>

              <RecentInterest loading={loading} height={600} user={currentUser}/>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column" alignItems="center">

              <Typography variant="h5">
                {compareAuthor.first_name} {compareAuthor.last_name}
              </Typography>

              <RecentInterest loading={loading} height={600} user={compareAuthor}/>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
