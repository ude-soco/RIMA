import React from "react";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import RecentInterest from "../../InterestProfile/RecentInterest/RecentInterest";
import {getUserInfo} from "../../../../Services/utils/functions";


export default function RecentInterestComparison({classes, loading, compareAuthor}) {
  const currentUser = getUserInfo();

  return (
    <Card className={classes.cardHeight}>
      <CardContent>
        <Grid container justify="center" className={classes.gutterLarge}>
          <Grid item>
            <Typography variant="h5">
              <b> Recent Interests </b>
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid container direction="column" alignItems="center" xs>
            <Typography variant="h5">
              {currentUser.first_name} {currentUser.last_name}
            </Typography>

            <RecentInterest loading={loading} height={600}/>
          </Grid>

          <Grid container direction="column" alignItems="center" xs>

            <Typography variant="h5">
              {compareAuthor.first_name} {compareAuthor.last_name}
            </Typography>

            <RecentInterest loading={loading} height={600} user={compareAuthor}/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
