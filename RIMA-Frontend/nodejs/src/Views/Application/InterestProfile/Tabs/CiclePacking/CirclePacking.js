import React, { useState, useEffect } from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { CircularProgress, Grid, Typography } from "@material-ui/core";

const MyResponsiveCirclePacking = ({ data }) => (
  <ResponsiveCirclePacking
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    id="name"
    value="loc"
    colors={{ scheme: "nivo" }}
    colorBy="id"
    childColor={{
      from: "color",
      modifiers: [["brighter", 0.4]],
    }}
    padding={4}
    enableLabels={true}
    labelsSkipRadius={10}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    borderWidth={1}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0.5]],
    }}
    defs={[
      {
        id: "lines",
        background: "none",
        color: "inherit",
        rotation: -45,
        lineWidth: 5,
        spacing: 8,
      },
    ]}
    fill={[
      {
        match: {
          depth: 1,
        },
        id: "lines",
      },
    ]}
  />
);

export default function CirclePacking(props) {
  const { keywords } = props;

  const [interests, setInterests] = useState([]);

  useEffect(() => {
    let tempInterests = [];
    keywords.forEach((keyword) => {
      tempInterests.push({
        name: keyword.text,
        loc: keyword.value,
      });
    });
    setInterests(tempInterests);
  }, []);

  return (
    <>
      {!interests ? (
        <>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress />
            </Grid>
            <Grid item>
              <Typography variant="overline"> Loading data </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <div style={{ width: 500, height: 500, margin: "auto" }}>
            <MyResponsiveCirclePacking data={{ children: interests }} />
          </div>
        </>
      )}
    </>
  );
}
