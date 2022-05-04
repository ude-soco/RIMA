import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

export default function Seperator(props) {
  const { Label, Width } = props;

  return (
    <Grid className="Seperator">
      <Grid item md={11} style={{ color: "#2d3985" }}>
        {Label}
      </Grid>
      <Grid item md={11} className="d-flex justify-content-center">
        <Grid
          style={{
            width: Width + "px",
            height: "3px",
            backgroundColor: "#2d3985",
            borderRadius: 5,
            marginTop: "2px",
          }}
        ></Grid>
      </Grid>
    </Grid>
  );
}