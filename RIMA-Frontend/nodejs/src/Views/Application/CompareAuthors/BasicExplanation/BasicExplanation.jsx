import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import VennDiagram from "../../../components/UserCharts/VennDiagram";

export default function BasicExplanation({classes, similarityScores, compareAuthor}) {

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item>
          <Typography variant="h5" gutterBottom color="textSecondary">
            <b> Basic Explanation: Semantic-based similarity of users’ interest models</b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterLarge}>
        <Grid item xs>
          <VennDiagram
            first_name={compareAuthor.first_name}
            last_name={compareAuthor.last_name}
            venn_chart_data={similarityScores.venn_chart_data}
          />
        </Grid>
      </Grid>
    </>
  );
}
