//Implemented by Islam Abdelghaffar
import React, { useState } from "react";

import {
  Grid,
  Box,
  Paper,
  Typography,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import ReactWordcloud from "react-wordcloud";
import EnhancedTable from "./EnhancedTable";
import CustomizedDialog from "Views/Application/ReuseableComponents/CustomizedDialog.jsx";

const TotalSharedTopicsKeywordsCloud = ({
  callbackCloud,
  callbackCommonCloud,
  firstCloudTitle,
  secondCloudTitle,
  firstCloudData,
  secondCloudData,
  commonCloudData,
  comparisonBased,
  comparisonBetween,
  common_keywords_topics_details,
}) => {
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedWordCloudData, setSelectedWordCloudData] = useState([]);

  const callbackFirst = {
    getWordTooltip: (word) => {
      return `Word: ${word.text} | ${callbackCloud}: ${word.value}`;
    },
    onWordClick: (word) => {
      setSelectedWord(word.text);
      setSelectedWordCloudData(firstCloudData);
      return;
    },
  };

  const callbackSecond = {
    getWordTooltip: (word) => {
      return `Word: ${word.text} | ${callbackCloud}: ${word.value}`;
    },
    onWordClick: (word) => {
      setSelectedWord(word.text);
      setSelectedWordCloudData(secondCloudData);
      return;
    },
  };

  const callBackCommon = {
    getWordTooltip: (word) => {
      return `Word: ${word.text} | ${callbackCommonCloud}: ${word.value}`;
    },
    onWordClick: (word) => {
      setSelectedWord(word.text);
      setSelectedWordCloudData(commonCloudData);
      return;
    },
  };

  const [openCustomizedDialog, setOpenCustomizedDialog] = useState(false);
  const [items, setItem] = useState([]);
  const [eventname, setEventname] = useState();
  const [keywordOrTopic, setKeywordsOrTopic] = useState("");
  const [selectedKeywordTopic, setSelectedKeywordTopic] = useState("");

  const style = {
    ContainerStyle: {
      borderRadius: "40px",
      padding: "1%",
      marginTop: "2%",
    },
    itemStyle: {
      width: "49%",
      borderRadius: "40px",
      backgroundColor: "#F0F8FF",
      border: "1px solid #000",
      padding: "1%",
    },
    CardHeaderStyle: {
      borderRadius: "40px",
      backgroundColor: "#F0F8FF",
      border: "1px solid #000",
    },
    options: {
      colors: ["#90EE90", "#0BDA51", "#17B169", "#03C03C", "#00693E"],
      enableTooltip: true,
      deterministic: true,
      fontFamily: "Arial",
      fontSizes: [15, 45],
      fontStyle: "oblique",
      fontWeight: "normal",
      padding: 3,
      rotations: 1,
      rotationAngles: [0, 90],
      scale: "sqrt",
      spiral: "archimedean",
      transitionDuration: 1000,
    },
    HeaderTitleStyle: { variant: "h6", style: { fontSize: "1rem" } },
  };

  return (
    <Grid
      container
      component={Paper}
      md={12}
      style={{
        ...style.ContainerStyle,
      }}
    >
      <Grid
        item
        xs={12}
        component={Paper}
        md="auto"
        style={{
          ...style.itemStyle,
        }}
      >
        <CardHeader
          style={{
            ...style.CardHeaderStyle,
            fontSize: "1rem",
          }}
          title={firstCloudTitle}
          titleTypographyProps={style.HeaderTitleStyle}
        />
        <CardContent>
          {firstCloudData && firstCloudData.length != 0 ? (
            <ReactWordcloud
              words={firstCloudData}
              options={style.options}
              callbacks={callbackFirst}
            />
          ) : (
            <Box>
              <Typography>No keywords/topics found</Typography>
            </Box>
          )}
        </CardContent>
      </Grid>
      <Grid
        item
        md="auto"
        xs={12}
        component={Paper}
        style={{
          ...style.itemStyle,
          marginLeft: "auto",
        }}
      >
        <CardHeader
          style={{
            ...style.CardHeaderStyle,
          }}
          title={secondCloudTitle}
          titleTypographyProps={style.HeaderTitleStyle}
        />
        <CardContent>
          {secondCloudData.length != 0 ? (
            <ReactWordcloud
              words={secondCloudData}
              options={style.options}
              callbacks={callbackSecond}
            />
          ) : (
            <Box>
              <Typography>No keywords/topics found</Typography>
            </Box>
          )}
        </CardContent>
      </Grid>
      <Grid
        item
        component={Paper}
        xs={12}
        md={6}
        style={{
          ...style.itemStyle,
          marginTop: "1%",
        }}
      >
        <CardHeader
          style={{
            ...style.CardHeaderStyle,
          }}
          variant="h5"
          align="center"
          title={`Common ${comparisonBased} between two selected ${comparisonBetween}`}
        />
        <CardContent>
          <Grid container xs={12}>
            <Grid item md={6} xs={12}>
              {commonCloudData && commonCloudData.length > 0 ? (
                <ReactWordcloud
                  words={commonCloudData}
                  options={style.options}
                  callbacks={callBackCommon}
                />
              ) : (
                <Typography align="center">
                  No common {comparisonBased} between two selected
                  {comparisonBetween}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Grid>
      <Grid item xs={12} md={6}>
        <CardContent>
          <Grid container xs={12}>
            {common_keywords_topics_details &&
              common_keywords_topics_details.length >= 1 && (
                <EnhancedTable rows={common_keywords_topics_details} />
              )}
          </Grid>
        </CardContent>
      </Grid>
      <Grid item>
        {openCustomizedDialog &&
          items &&
          eventname &&
          comparisonBased &&
          selectedWord && (
            <CustomizedDialog
              publications={items}
              keywordsOrTopicsProp={selectedWordCloudData}
              selectedKeywordTopicProp={selectedWord}
              eventnameProp={eventname}
              keywordsOrTopicProp={comparisonBased}
            />
          )}
      </Grid>
    </Grid>
  );
};
export default TotalSharedTopicsKeywordsCloud;
