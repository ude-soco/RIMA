import React from "react";

import { Box, Grid, Typography } from "@material-ui/core";
const InfoBox = ({ Info }) => {
  return (
    <Grid container md={6} xs={12}>
      <Grid
        item
        className="imgTooltip"
        style={{
          color: "#8E8E8E",
          border: "1px solid #BDBDBD",
        }}
      >
        <Typography> {Info}. </Typography>
      </Grid>
    </Grid>
  );
};
export default InfoBox;
