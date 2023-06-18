//implemented by Islam Abdelghaffar

import React from "react";

import { Box, Grid, Typography } from "@material-ui/core";
const InfoBox = ({ Info, marginLeft = "10%" }) => {
  return (
    <Grid
      item
      md={4}
      xs={12}
      justify="center"
      alignItems="center"
      className="imgTooltip"
      style={{
        color: "#8E8E8E",
        border: "1px solid #BDBDBD",
        zIndex: 999,
        marginLeft: marginLeft,
      }}
    >
      <Typography> {Info} </Typography>
    </Grid>
  );
};
export default InfoBox;
