import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import IconButton from "@material-ui/core/IconButton";

import Grid from "@material-ui/core/Grid";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

const useStyles = makeStyles({
  root: {
    width: 210,
  },
});

export default function CustomizedSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    setValue(props.weight);
  }, [props]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeTagWeight(props.index, newValue);
  };

  const handleTagChange = () => {
    props.handleSearchButtonClick1(true);
  };

  return (
    <div
      style={{
        backgroundColor: `${props.color}`,
        maxHeight: "5vh",
        width: "200px",
        textOverflow: "ellipsis",
        borderRadius: "5px",
      }}
      className={` pl-1 pr-1 pt-0 mb-2 pb-2  Rounded  text-white `}
    >
      <p
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginBottom: "-20px",
          marginTop: "1px",
          fontSize: "14px",
          overflow: "hidden",
          maxWidth: "120px",
        }}
      >
        {props.name}
      </p>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs md={6}>
            <Slider
              style={{
                color: "#FFFFFF",
                marginBottom: "3px",
                marginLeft: "6px",
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
          <Grid item xs md={2}>
            <span>{props.weight}</span>
          </Grid>
          <Grid item md={2} style={{ color: "#FFFFFF" }}>
            <IconButton
              onClick={() => props.handleDelete(props.index)}
              aria-label="delete"
              style={{
                color: "#FFFFFF",
                marginTop: "-15px",
                marginLeft: "-5px",
                marginRight: "5px",
              }}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
