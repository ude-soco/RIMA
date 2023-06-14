//implemented by Islam Abdelghaffar
import React from "react";
import { Grid, Box, Badge } from "@material-ui/core";
import ReactApexChart from "react-apexcharts";

const BarCharWithBadge = ({
  badgeTitle,
  commontpcs,
  badgeMessage,
  options,
  series,
}) => {
  return (
    <Grid container style={{ opacity: 1, marginTop: "1%" }}>
      <Grid item style={{ width: "80%" }}>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      </Grid>
      <Grid item>
        <h5>{badgeTitle}</h5>
        {commontpcs.length == 0 ? (
          <Box>{badgeMessage}</Box>
        ) : (
          commontpcs.map((number) => (
            <Badge
              style={{
                margin: "1%",
                backgroundColor: "#99e4ee",
                borderRadius: "10px",
                color: "#00bcd4",
                textTransform: "uppercase",
                padding: "5px",
                fontSize: "9px",
                fontFamily: "Arial",
              }}
            >
              {number}
            </Badge>
          ))
        )}
      </Grid>
    </Grid>
  );
};
export default BarCharWithBadge;
