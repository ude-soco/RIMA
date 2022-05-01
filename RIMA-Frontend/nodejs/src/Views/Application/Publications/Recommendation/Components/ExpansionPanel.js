import React, { useEffect, useState } from "react";
import {
  Button as ButtonMUI,
  Collapse,
  Grid,
  makeStyles,
  Typography,
  CssBaseline,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SettingsIcon from "@material-ui/icons/Settings";

import HowExplanation from "../Components/HowExplanation";
import WhyExplanation from "../Components/WhyExplanation";

import Seperator from "./Seperator";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { WhatIfInterests } from "./WhatIfInterests";
import { WhatIfKeywords } from "./WhatIfKeywords";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "10px",
  },
  collapse: {
    backgroundColor: theme.palette.common.white,
  },
  collapseButton: {
    margin: "10px",
    display: "flex",
    justifyContent: "flex-end",
  },
  center: {
    display: "flex",
    justifyContent: "center ",
  },
}));

// Jaleh start
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Grid>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
// Jaleh end
export default function ExpansionPanel(props) {
  // Tannaz start
  const [whyShow, setWhyShow] = useState(false);
  const [whatIfShow, setWhatIfShow] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [whatIfExpanded, setWhatIfExpanded] = useState(false);
  const [howExpanded, setHowExpanded] = useState(false);
  // Jaleh
  const paper = props.paper;
  const interests = props.interests;
  const index = props.index;
  const [value, setValue] = useState(0);

  const classes = useStyles();

  const handleWhyExpandClick = () => {
    setWhyExpanded(!whyExpanded);
    setWhatIfExpanded(false);
    // Back Button:
    setWhyShow(!whyShow);
    setWhatIfShow(false);
  };
  const handleWhatIfExpandClick = () => {
    setWhatIfExpanded(!whatIfExpanded);
    setWhyExpanded(false);
    // Back Button:
    setWhatIfShow(!whatIfShow);
    setWhyShow(false);
  };

  // Tannaz end
  // Jaleh Start
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  // Jaleh end
  return (
    // Tannaz start
    <>
      <CssBaseline />

      <Grid container spacing={0} className={classes.collapseButton}>
        <Grid md={1}>
          <ButtonMUI
            variant="string"
            onClick={() => {
              handleWhyExpandClick();
            }}
          >
            Why?
          </ButtonMUI>
        </Grid>
        <Grid item md={2}>
          <ButtonMUI
            variant="text"
            onClick={() => {
              handleWhatIfExpandClick();
            }}
          >
            What-If?
          </ButtonMUI>
        </Grid>
      </Grid>

      {/* Handling th Back button */}

      <Collapse in={whyExpanded} className={classes.collapse}>
        {whyShow && (
          <Grid className="d-flex justify-content-start ">
            <ButtonMUI
              variant="string"
              onClick={() => {
                setWhyShow(false);
                setWhyExpanded(!whyExpanded);
              }}
            >
              <ArrowBackIosIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2">
                Back
              </Typography>
            </ButtonMUI>
          </Grid>
        )}

        {/* Why visualizations */}
        <Grid container className={classes.root} spacing={2}>
          <Seperator Label="Why this publication?" Width="170" />

          <Grid item md={12} className={classes.collapseButton}>
            <ButtonMUI
              variant="string"
              size="small"
              className="m-2 mr-4"
              onClick={() => {
                setHowExpanded(!howExpanded);
              }}
            >
              <SettingsIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2" className="ml-1">
                How?
              </Typography>
            </ButtonMUI>{" "}
          </Grid>
          <Grid item md={12} className={classes.collapseButton}>
            <WhyExplanation index={index} paper={paper} interests={interests} />
          </Grid>
        </Grid>

        {/* How Visualizations */}
        <Collapse in={howExpanded} className={classes.collapse}>
          <Grid container className={classes.root} spacing={0}>
            <Seperator Label="How the system works?" Width="200" />
            <HowExplanation index={index} paper={paper} interests={interests} />
          </Grid>
        </Collapse>
      </Collapse>

      <Collapse in={whatIfExpanded} className={classes.collapse}>
        {whatIfShow && (
          <Grid className="d-flex justify-content-start ">
            <ButtonMUI
              variant="text"
              onClick={() => {
                setWhatIfShow(false);
                setWhatIfExpanded(!whatIfExpanded);
              }}
            >
              <ArrowBackIosIcon color="action" fontSize="small" />
              <Typography align="center" variant="subtitle2">
                Back
              </Typography>
            </ButtonMUI>
          </Grid>
        )}
        <Grid container className={classes.root} spacing={2}>
          {/* What-if visualization */}

          {/* <Seperator Label="What-if I change?" Width="170" /> */}
          {/* Jaleh */}
          <Grid container>
            <Grid
              item
              md={12}
              style={{
                borderBottom: "1px solid #2d3985",
                borderColor: "#2d3985",
                alignContent: "center",
                margin: "0px 10px",
              }}
            >
              <Tabs
                centered
                value={value}
                onChange={handleTabChange}
                TabIndicatorProps={{
                  style: {
                    background: "#2d3985",
                    height: "3px",
                    borderRadius: "5",
                    color: "#2d3985",
                  },
                }}
              >
                <Tab label="What if 'interests' changed?" className="tab" />
                <Tab label="What if 'Keywords' changed?" className="tab" />
              </Tabs>
            </Grid>
            <TabPanel value={value} index={0}>
              <WhatIfInterests
                paper={paper}
                interests={interests}
                index={index}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              {/* <WhatIfKeywords paper={paper} interests={tags} /> */}
            </TabPanel>
          </Grid>
        </Grid>
      </Collapse>
    </>
    // Tannaz end
  );
}
