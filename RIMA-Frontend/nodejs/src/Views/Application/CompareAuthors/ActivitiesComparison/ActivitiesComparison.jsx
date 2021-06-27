import React from "react";
import {getUserInfo} from "../../../../Services/utils/functions";
import {Divider, Grid, Typography} from "@material-ui/core";
import Activities from "../../InterestProfile/Activities/Activities";

export default function ActivitiesComparison({classes, loading, compareAuthor}) {
  const currentUser = getUserInfo();
  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Activities: Publications and Tweets </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>

      <Grid container className={classes.gutter} justify="center">
        <Grid item xs={12} md={6}>
          <Grid container direction="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              {currentUser.first_name} {currentUser.last_name}
            </Typography>
            <Grid item>
              <Activities classes={classes} loading={loading} elevation={false} vertical={true}/>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grid container direction="column" alignItems="center">

            <Typography variant="h5" color="textSecondary">
              {compareAuthor.first_name} {compareAuthor.last_name}
            </Typography>
            <Grid item>
              <Activities classes={classes} user={compareAuthor} loading={loading} elevation={false} vertical={true}/>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
