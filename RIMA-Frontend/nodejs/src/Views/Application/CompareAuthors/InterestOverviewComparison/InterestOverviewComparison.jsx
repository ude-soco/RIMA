import React from 'react'
import {Divider, Grid, Typography} from "@material-ui/core";
import {getUserInfo} from "../../../../Services/utils/functions";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";

export default function InterestOverviewComparison ({classes, compareAuthor}) {
  const currentUser = getUserInfo();
  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Interests Overview </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>

      <Grid container >
        <Grid item xs={6}>
          <Grid container direction="column" alignItems="center">
            <Typography variant="h5" color="textSecondary">
              {currentUser.first_name} {currentUser.last_name}
            </Typography>

            <CloudChart/>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction="column" alignItems="center">

            <Typography variant="h5" color="textSecondary">
              {compareAuthor.first_name} {compareAuthor.last_name}
            </Typography>

            <CloudChart user={compareAuthor}/>
          </Grid>
        </Grid>
      </Grid>
   </>
  );
}
