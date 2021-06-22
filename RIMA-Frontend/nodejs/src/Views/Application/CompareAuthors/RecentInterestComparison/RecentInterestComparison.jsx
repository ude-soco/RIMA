import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import RecentInterest from "../../InterestProfile/RecentInterest/RecentInterest";
import {getUserInfo} from "../../../../Services/utils/functions";


export default function RecentInterestComparison({classes, loading, compareAuthor}) {
  const currentUser = getUserInfo();

  return (
    <>
      <Grid container  className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Recent Interests </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>

      <Grid container className={classes.gutterLarge}>
        <Grid container direction="column" alignItems="center" xs>
          <Typography variant="h5" color="textSecondary" className={classes.gutter}>
            {currentUser.first_name} {currentUser.last_name}
          </Typography>
          <Typography color="textSecondary">
            This chart shows your recent interests in the last year (for publications), and last month (for tweets).
          </Typography>

          <RecentInterest loading={loading} height={600}/>
        </Grid>

        <Grid container direction="column" alignItems="center" xs>

          <Typography variant="h5" color="textSecondary" className={classes.gutter}>
            {compareAuthor.first_name} {compareAuthor.last_name}
          </Typography>
          <Typography color="textSecondary">
            This chart shows your recent interests in the last year (for publications), and last month (for tweets).
          </Typography>

          <RecentInterest loading={loading} height={600} user={compareAuthor}/>
        </Grid>
      </Grid>
    </>
  );
}
