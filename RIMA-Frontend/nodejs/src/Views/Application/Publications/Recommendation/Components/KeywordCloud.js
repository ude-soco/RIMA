//---------------Hoda Start-----------------
import React, { Component } from "react";
import {Paper, CardContent, Grid, Typography} from "@material-ui/core";
import "../assets/styles.css";
import ReactWordcloud from "react-wordcloud";
import "./TopSimilarityChart"
import { select } from "d3-selection";

export function getKeywordScore(keywords)
{
  let items=[];
  if(!keywords) return [{keyword:"",score:0,color:""}];
  let i=0;
  for(let p2 in keywords)
  {
    let value=keywords[p2];
    items.push({keyword:p2,score:value.max_score,color:value.max_interest_color});
  }
  return items.sort((a,b)=>a.score<b.score?1:a.score==b.score?0:-1);
}

function KeywordCloud({keywords,onClickItem}) {
  let simKeywords=keywords;
  keywords=getKeywordScore(simKeywords);
  let words=keywords.map(x=> ({text:x.keyword,value:x.score}));
  let colors=keywords.map(x=>x.color);


  const options = {
    colors: colors,
    enableTooltip: false,
    deterministic: true,
    fontFamily: "Arial",
    fontSizes: [10, 30],
    fontStyle: "oblique",
    fontWeight: "normal",
    padding: 3,
    rotations: 1,
    rotationAngles: [0, 90],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
    };

    function getCallback(callback) {
      return function (word, event) {
        const isActive = callback !== "onWordMouseOut";
        const element = event.target;
        const text = select(element);
        let defaultFontSize= text.attr('data-default-font-size');
        if(!defaultFontSize)
        {
          defaultFontSize=text.attr("font-size");
          text.attr('data-default-font-size',defaultFontSize);
        }
        const hoverFontSize=(Number.parseInt( defaultFontSize.replace('px',''))*1.5).toString()+"px";
        const actualFontSize=isActive ? hoverFontSize : defaultFontSize
        text.transition().attr("font-size",actualFontSize )
        
        if (isActive) {
          if(!!onClickItem) onClickItem(word.text,simKeywords[word.text]);
        }
        else{
          if(!!onClickItem) onClickItem(null,null);
        }
      };
    }
    
    const callbacks = {
      getWordColor: (word) => keywords.find(x=> x.keyword===word.text).color,
      getWordTooltip: (word) =>`Similarity Score: ${(Math.round( word.value*100)/100)}`,
      onWordMouseOut: getCallback("onWordMouseOut"),
      onWordMouseOver: getCallback("onWordMouseOver")
    };
    
  return <ReactWordcloud callbacks={callbacks} options={options} words={words} />;
}

export default KeywordCloud;
//---------------Hoda End-----------------