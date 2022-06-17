import React, { useState } from "react";
import Flowchart from "./Flowchart";
import { Divider, Paper, Grid, Hidden, Typography, Box } from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { wordElementProviderWithCoordinate } from "./FlowChartUtil";
import ReactTooltip from "react-tooltip";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// Hoda start
const useStyles = makeStyles((theme) => ({
  paperCustom: {
    width: "100%"
  },
  typographyCustom: {
    padding:"15px 0px",
    textAlign: "center",
    "& span":{
        fontSize:"1.2rem"
    }
    // "&> span":{
    //     padding:"15px 30px",
    //     border:"2px solid black",
    //     borderRadius:"8px"  
    // },
    // "&> span.orange":{
    //     borderColor:"orange",
    // },
    // "&> span.blue":{
    //     borderColor:"blue",
    // }
  },
  dividerCustom: {
    marginTop: "2rem"
  },
  tooltipText: {
      textAlign:'center',
      fontSize:13,
      fontFamily:'"Roboto", "Helvetica", "Arial", sans-serif'
  }
}));
// Create keyword list of user interest and publication keywords
// Display 'USER INTERESTS AND PUBLICATION KEYWORDS' 
function WordList({
  words,
  prefix,
  title,
  titleBorderColor,
  isSplit,
  inclEmbedding,
  modelLabel,
  tooltipContent
  //secondCol
}) {
  const classes = useStyles();
  //const  wordElements  =(secondCol?
    //getFinalElement(prefix,modelLabel,secondCol.prefix,secondCol.modelLabel,secondCol.scoreTitle): 
    const  wordElements =wordElementProviderWithCoordinate(
      words,
      prefix+(inclEmbedding?"E":"D"),
      isSplit,
      inclEmbedding,
      modelLabel
    );
   const tooltipId=prefix+"tooltip"
  return (
      <Grid container direction="column">
        <Grid item container direction="row">
          <Grid item xs={12} 
            // sm={secondCol?6:12}
            >
        {tooltipContent?(<ReactTooltip className={classes.tooltipText}  place="bottom" 
          id={tooltipId}
          effect={"solid"}>{tooltipContent}</ReactTooltip>):""}
            <Typography variant="subtitle2" className={classes.typographyCustom}>
              <span className={""}>{title} {tooltipContent?(<span data-tip data-for={tooltipId} ><sup><InfoOutlinedIcon  fontSize="small" color= "disabled" /></sup></span>):""}</span>             
            </Typography>
            </Grid>
          {/* {secondCol?(<Grid item sx={12} sm={6}>
            <Typography variant="subtitle1" className={classes.typographyCustom}>
            <span className={secondCol.titleBorderColor||""}>{secondCol.title}</span>
            </Typography>
          </Grid>):""} */}
        </Grid>
        {/* <Grid>
          <Divider style={{ margin: "2px 0" }} />
        </Grid> */}
        <Grid item container xs>
            <Paper className={classes.paperCustom} evaluate={0}>
                <Flowchart
                    keyChart={prefix}
                    elements={wordElements}
                    height={400}
                    xStartPoint={0}
                    yStartPoint={0}
                    //layout={{ name: "fcose" }}
                    //layout={!secondCol?{ name: "fcose" }:undefined}
                />
            </Paper>
        </Grid>
      </Grid>
  );
}
export default function HowStep({
  interests,
  keywords,
  isSplit,
  inclEmbedding,
  scoreTitle
}) {
    const firstCol={
        title:"Interest Model",
        prefix:"Interest",
        titleBorderColor:"blue",
        modelLabel:"INTEREST MODEL EMBEDDING",
        // tooltipContent:"The colors of the interest keywords is based on their similarity to the relevant interest and the numbers show the interest weights",
         tooltipContent: (<>Consists of 
          <Typography  style={{fontStyle:"italic"}} variant="xx" component="span">
          &nbsp;Your Interests
          </Typography>
          &nbsp;and respective weights</>),
        words:interests,
      };
      const secondCol={
        title:"Publication",
        prefix:"Publication",
        titleBorderColor:"orange",
        modelLabel:"PUBLICATION EMBEDDING",
        // tooltipContent:"The colors of the publication keywords is based on their similarity to the relevant interest and the numbers show the keywords weights",
        tooltipContent: (<>Consists of extracted publication keywords and their respective weights. Color is based on the most relevant interest in 
          <Typography  style={{fontStyle:"italic"}} variant="xx" component="span">
          &nbsp;Your Interests
          </Typography>
        </>),
        words:keywords
      };
return (
    <Grid container direction="row" spacing={3}>
      <Grid item xs={12} sm={scoreTitle?12:6}>
        <WordList
          isSplit={isSplit}
          inclEmbedding={inclEmbedding}
          words={firstCol.words}
          modelLabel={firstCol.modelLabel}
          prefix={firstCol.prefix}
          title={firstCol.title}
          titleBorderColor={firstCol.titleBorderColor}
          tooltipContent={firstCol.tooltipContent}
          
        //   secondCol={scoreTitle?{...secondCol,
        //     scoreTitle:scoreTitle,
        //   }:undefined}
        />
      </Grid>
      {scoreTitle?"":(<Grid item xs={12} sm={6}>
        <WordList
          isSplit={isSplit}
          inclEmbedding={inclEmbedding}
          words={secondCol.words}
          modelLabel={secondCol.modelLabel}
          prefix={secondCol.prefix}
          title={secondCol.title}
          titleBorderColor={secondCol.titleBorderColor}
          tooltipContent={secondCol.tooltipContent}
        />
      </Grid>)}
    </Grid>
  );
}
