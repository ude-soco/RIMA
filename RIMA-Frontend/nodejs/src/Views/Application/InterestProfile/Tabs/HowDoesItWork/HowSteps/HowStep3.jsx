import React from "react";
import {Grid, Typography,} from "@material-ui/core";
import CreateNodeLink from "./NodeLinkVis/CreateNodeLink";

const HowStep3 = (props) => {
  const {keywords} = props;

  return (
    <>
      <Grid container direction="column">

        <Typography variant="h5" style={{paddingBottom: 16}}>
          Extract keywords
        </Typography>

        <Typography style={{paddingBottom: 24}}>
          From your provided data sources, the system is extracting possible
          keywords and their weights. The data of up to five keywords are shown.
        </Typography>

        <CreateNodeLink data={keywords}/>

      </Grid>
    </>
  );
}

export default HowStep3