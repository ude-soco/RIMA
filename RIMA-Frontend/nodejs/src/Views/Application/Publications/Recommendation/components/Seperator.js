import React from "react";
import Grid from "@material-ui/core/Grid";

/**
 *
 * @param {Object} props Label(String),Width(Number)
 * @returns The seperator component
 */
const Seperator = (props) => {
  const { Label, Width } = props;

  return (
    <Grid className="Seperator">
      <Grid item md={12} style={{ color: "#2d3985" }}>
        {Label}
      </Grid>
      <Grid item md={12} className="d-flex justify-content-center">
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
};
export default Seperator;
