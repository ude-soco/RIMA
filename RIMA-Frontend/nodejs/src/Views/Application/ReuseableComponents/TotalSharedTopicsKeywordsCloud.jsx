//Implemented by Islam Abdelghaffar
import React, { useState } from "react";
import ActiveLoader from "Views/Application/ReuseableComponents/ActiveLoader";

import {
  Grid,
  Box,
  InputLabel,
  Paper,
  Typography,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import ReactWordcloud from "react-wordcloud";

const TotalSharedTopicsKeywordsCloud = ({
  callbackCloud,
  callbackCommonCloud,
  firstCloudTitle,
  secondCloudTitle,
  fistCloudData,
  secondCloudData,
  commonCloudData,
  comparisonBased,
  comparisonBetween,
}) => {
  const callBack = {
    getWordTooltip: (word) =>
      `Word: ${word.text} | ${callbackCloud}: ${word.value}`,
  };
  const callBackCommon = {
    getWordTooltip: (word) =>
      `Word: ${word.text} | ${callbackCommonCloud}: ${word.value}`,
  };

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
          {fistCloudData.length != 0 ? (
            <ReactWordcloud
              words={fistCloudData}
              options={style.options}
              callbacks={callBack}
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
              callbacks={callBack}
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
              {commonCloudData ? (
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
    </Grid>
  );
};
export default TotalSharedTopicsKeywordsCloud;
