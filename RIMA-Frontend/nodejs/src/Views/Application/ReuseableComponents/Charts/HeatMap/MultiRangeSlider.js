import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from "@material-ui/core/Slider";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  root: {
    width: 250,
    color: "#adacaa",
  },
  margin: {
    height: theme.spacing(3),
  },
}));
function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
};
const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 100,
    label: "100",
  },
];

function valuetext(value) {
  return value;
}

export default function TrackFalseSlider(props) {
  const {
    verySimilar,
    slightlySimilar,
    similar,
    setverySimilar,
    setSimilar,
    setSlightlySimilar,
  } = props;
  const classes = useStyles();
  const handleChange = (event) => {
    let l = slightlySimilar.to,
      r = verySimilar.from;
    const valNow = parseFloat(event.target.getAttribute("aria-valuenow"));
    if (event.target.getAttribute("data-index") == "0") {
      l = valNow;
      setSlightlySimilar((prevState) => ({
        ...prevState,
        to: l,
      }));
      setSimilar((prevState) => ({
        ...prevState,
        from: l,
      }));
    } else if (event.target.getAttribute("data-index") == "1") {
      r = valNow;
      setverySimilar((prevState) => ({
        ...prevState,
        from: r,
      }));
      setSimilar((prevState) => ({
        ...prevState,
        to: r,
      }));
    }

  };
  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      <h5>Change the similarity range you want to see:</h5>
      {/*<Slider
        style={{
          color: "#adacaa",
          marginBottom: "3px",
          marginLeft: "6px",
        }}
        onChange={handleChange}
        track={false}
        aria-labelledby="track-false-range-slider"
        getAriaValueText={valuetext}
        defaultValue={[1, 50]}
        marks={marks}
      />*/}
      <Slider
        onChange={handleChange}
        valueLabelDisplay="auto"
        components={{
          ValueLabel: ValueLabelComponent,
        }}
        aria-label="custom thumb label"
        defaultValue={1}
      />
    </div>
  );
}
