import React from "react";
import {Grid, Typography,} from "@material-ui/core";
import CreateNodeLink from "./NodeLinkVis/CreateNodeLink";
import data from "./data"

const HowStep4 = (props) => {
  const { keywords } = props;

  console.log(keywords)
  return (
    <>
      <Grid container direction="column">
        <Typography variant="h5" style={{paddingBottom: 16}}>
          Generate interest profile
        </Typography>

        <Typography style={{paddingBottom: 24}}>
          The final interest profile is generated using similarities between
          keywords. Only the data from your top 5 keywords is shown
        </Typography>

        <CreateNodeLink data={data} step4={true}/>
      </Grid>
    </>
  );
}

export default HowStep4