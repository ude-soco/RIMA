/**
 * Slider.js - Interest slider component
 * is used for what-if explanations' control panel
 * contains:
 * 1. slider component
 */
import React from "react";
import Slider from "@material-ui/core/Slider";

import { Typography, Grid } from "@material-ui/core";

import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
/**
 * @function CustomizedSlider
 * Interest slider component
 * @param {Object} props name(String),weight(Number),color(String),index(Number),
 * handleTagsChange(function),changeTagWeight(function),handleDelete(function)
 * @returns The slider component
 */
const CustomizedSlider = (props) => {
  const [value, setValue] = React.useState(props.weight);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeTagWeight(props.index, newValue);
  };

  return (
    <Grid
      item
      container
      style={{
        backgroundColor: `${props.color}`,
        maxHeight: "40px",
        borderRadius: "5px",
        justifyContent: "flex-end",
      }}
      className={`p-1 pt-0 Rounded text-white`}
    >
      <Grid container spacing={2}>
        <Grid item md={2} style={{ color: "#FFFFFF" }}>
          <RemoveCircleOutlineIcon
            onClick={() => props.handleDelete(props.index)}
            aria-label="delete"
            style={{
              color: "#FFFFFF",
            }}
          />
        </Grid>
        <Grid item md={10}>
          <Typography
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: "14px",
              overflow: "hidden",
            }}
          >
            {props.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ justifyContent: "flex-end" }}>
        <Grid
          item
          xs
          md={8}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <Slider
            style={{
              color: "#FFFFFF",
              padding: "0px",
            }}
            min={1}
            step={0.5}
            max={5}
            defaultValue={props.weight}
            onChangeCommitted={handleChange}
          />
        </Grid>
        <Grid item xs md={3} style={{ marginTop: "-10px" }}>
          <Typography align="center">{value}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default CustomizedSlider;
