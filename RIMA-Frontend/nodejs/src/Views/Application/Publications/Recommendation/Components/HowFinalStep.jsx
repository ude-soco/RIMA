import React, { useState } from "react";
import {
  Divider,
  Paper,
  ListItem,
  List,
  Grid,
  Box,
  Hidden,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Flowchart from "./Flowchart";
import {getFinalElement} from "./FlowChartUtil";
import ReactTooltip from "react-tooltip";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// Hoda start
const useStyles = makeStyles((theme) => ({
  paperCustom: {
    padding: "1rem",
    fontFamily: "roboto",
    margin: "0.2rem",
  },
  typographyCustom: {
    padding:"15px 0px",
    textAlign: "center",
    "& span":{
        fontSize:"1.2rem"
    }

    // "& span":{
    //     padding:"15px 30px",
    //     border:"2px solid blue",
    //     borderRadius:"8px"  
    // },
    // "& span.orange":{
    //     borderColor:"orange",
    // }
  },
  dividerCustom: {
    marginTop: "2rem"
  },
  itemBox: {
    margin: 0,
    padding: 10
  },
  tooltipText: {
      textAlign:'center',
      fontSize:13,
      fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif'
  }
}));

function Title({title,prefix,tooltipContent,}){
    const tooltipId=prefix+"tooltip"
  const classes = useStyles();
  return (
    <>
    {tooltipContent?(<ReactTooltip className={classes.tooltipText}  place="bottom" 
        id={tooltipId} 
        effect={"solid"}>{tooltipContent}</ReactTooltip>):""}
          <Typography variant="subtitle2" className={classes.typographyCustom}>
            <span className={""}>{title} {tooltipContent?(<span data-tip data-for={tooltipId}><sup><InfoOutlinedIcon  fontSize="small" color= "disabled" /></sup></span>):""}</span>
          </Typography>
    </>
  );
}

export default function HowFinalStep({ paper }) {
  const classes = useStyles();
  const titleLeft={
      title:"Interest Model",
      prefix:"Interest",
      tooltipContent:"The colors of the interest keywords is based on their similarity to the relevant interest and the numbers show the interest weights",
  };
  const titleRight={
      title:"Publication",
      prefix:"Publication",
      tooltipContent:"The colors of the interest keywords is based on their similarity to the relevant interest and the numbers show the interest weights",
  };
  const finalScore=getFinalElement("Interest","INTEREST MODEL EMBEDDING","Publication",
                                   "PUBLICATION EMBEDDING","COSINE SIMILARITY", "SIMILARITY SCORE:" + paper.score + "%");
  return (
    <Paper  className={classes.paperCustom} elevation={0}>
       {/* Title 
       <Grid container direction="row" spacing={0}>
        <Grid item sx={12} sm={6}>
          <Title {...titleLeft} />
        </Grid>
        <Grid item sx={12} sm={6}>
          <Title {...titleRight} />
        </Grid>
      </Grid>  */}
      <Grid container direction="row" justify="space-between">
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          lg={8}
          xl={6}
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          style={{ maxHeight: "350px", height: "350px" }}
        >
             {/* <Grid item sx={12} sm={6}>
          <Typography className={classes.recnode}>
          <span >COSINE SIMILARITY</span>
          </Typography>
        </Grid> */}
          <Flowchart
            keyChart={"final"}
            elements={finalScore}
            height={400}
            xStartPoint={0}
            yStartPoint={0}
          />
        </Grid>
        <Hidden smDown>
          <Grid item xs={false} sm={false} md={1} lg={2} xl={3} />
        </Hidden>
      </Grid>
    </Paper>
  );
}
// Hoda end