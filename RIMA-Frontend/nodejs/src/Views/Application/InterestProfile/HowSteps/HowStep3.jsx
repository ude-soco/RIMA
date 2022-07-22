import React from "react";
import {Grid, Typography,} from "@material-ui/core";
import CreateNodeLink from "./NodeLinkVis/CreateNodeLink";
import data from "./data"

const HowStep3 = () => {

  //const { data } = props;

  return (
    <>
      <Grid container direction="column">

        <Typography variant="h5" style={{paddingBottom: 16}}>
          Extract keywords
        </Typography>

        <Typography style={{paddingBottom: 24}}>
          From your provided data sources, the system is extracting possible
          keywords and their weights. Only the data from your top 5 keywords is shown
        </Typography>

        <CreateNodeLink data={data} step4={false}/>

      </Grid>
    </>
  );
}

export default HowStep3