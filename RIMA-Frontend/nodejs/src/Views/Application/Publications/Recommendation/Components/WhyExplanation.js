//---------------Hoda Start-----------------
import React, { Component } from "react";
import {Paper, CardContent, Grid, Typography} from "@material-ui/core";
import "../assets/styles.css";
import KeywordCloud from "./KeywordCloud"
import TopSimilarityChart from "./TopSimilarityChart"

let activeTimeout=null;

function WhyExplanation({paper}) {
  const [activeChart, setActiveChart] = React.useState(null);
  const onClickItem=(word,interests)=>{
    if (activeChart?.word===word) return;
    if(!!activeTimeout) {
      clearTimeout(activeTimeout);
    }
    activeTimeout=setTimeout(()=>setActiveChart(!interests?null:{word,interests}),300);
  }  
  const chartTitle="";
  return <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">In this word cloud, you see the keywords extracted from the publication and by hovering over a keyword you can see its similarity score to your interests.</Typography>
          </Grid>
          <Grid item xs={7}>
            <div style={{ width: "90%" }}>
             <KeywordCloud keywords={paper.keywords_similarity} onClickItem={onClickItem} />
            </div>
          </Grid>
          <Grid item xs={5}>
            {(activeChart?<TopSimilarityChart interests={activeChart.interests} height={200} maxItem={100} title={"    "} />:<></>)}
          </Grid>
        </Grid>;
}

export default WhyExplanation;
//---------------Hoda End-----------------