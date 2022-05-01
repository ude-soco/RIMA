import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import { Typography } from '@mui/material';

import { Grid } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
const useStyles = makeStyles({
  root: {
    width: 210,
  },
});

export default function CustomizedSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.weight);
  // useEffect(() => {
  //   setValue(props.weight);
  // }, [props]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeTagWeight(props.index, newValue);
  };

  const handleTagChange = (event) => {
    props.handleTagsChange();
  };


  return (
    
      <Grid
        item container
        style={{
          backgroundColor: `${props.color}`,
          maxHeight: "40px",
          borderRadius: "5px",
          justifyContent: "flex-end"
        }}
        className={`p-1 pt-0 Rounded text-white`}>
        <Grid container spacing={2}>
          <Grid item md={2} style={{ color: "#FFFFFF" }}>
            <RemoveCircleOutlineIcon onClick={() => props.handleDelete(props.index)}
              aria-label="delete"
              style={{
                color: "#FFFFFF",
              }} />
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
          <Grid item xs md={8} style={{ display: 'flex', alignItems: "flex-start" }}>
            <Slider
              style={{
                color: "#FFFFFF",
                padding: '0px'
              }}
              min={1}
              max={5}
              step={0.1}
              value={value}
              onChange={handleChange}
              onMouseUp={handleTagChange}
              aria-labelledby="continuous-slider"
            />
          </Grid>
          <Grid item xs md={2} style={{ marginTop:"-10px" }}>
            <span>{value}</span>
          </Grid>

        </Grid>
      </Grid>
  );
}
