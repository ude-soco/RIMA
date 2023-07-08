import React, { useState } from "react";
import {
  ButtonGroup,
  Button as ButtonMUI,
  Collapse,
  Grid,
  makeStyles,
  Typography,
  CssBaseline,
  Box,
  Tabs,
  Tab,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HowExplanation from "./HowExplanation";
import Seperator from "./Seperator";
import PropTypes from "prop-types";
import { WhatIfInterests } from "./WhatIfInterests";
import { WhatIfKeywords } from "./WhatIfKeywords";
import WhyExplanation from "./WhyExplanation";
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined";
import TuneIcon from "@material-ui/icons/Tune";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "10px",
  },
  collapse: {
    backgroundColor: theme.palette.common.white,
  },
  collapseButton: {
    marginRight: "10px",
    display: "flex",
    justifyContent: "flex-end",
  },
  center: {
    display: "flex",
    justifyContent: "center ",
  },
  italicSubtitle2: {
    fontStyle: "italic",
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
  const threshold = props.threshold;
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

      {/* <Grid container spacing={2} className={classes.collapseButton}>
        <ButtonGroup color="primary" size="small">
          <ButtonMUI
            variant={whyExpanded ? "contained" : "outlined"}
            onClick={() => {
              handleWhyExpandClick();
            }}
          >
            {whyExpanded ? (
              <BarChartOutlinedIcon
                style={{ color: "white" }}
                fontSize="small"
              />
            ) : (
              <BarChartOutlinedIcon
                style={{ color: "#333fa1" }}
                fontSize="small"
              />
            )}
            <Typography
              align="center"
              variant="subtitle2"
              className="ml-1"
              style={whyExpanded ? { color: "white" } : { color: "#333fa1" }}
            >
              Why?
            </Typography>
          </ButtonMUI>
          <ButtonMUI
            variant={whatIfExpanded ? "contained" : "outlined"}
            onClick={() => {
              handleWhatIfExpandClick();
            }}
          >
            {whatIfExpanded ? (
              <TuneIcon style={{ color: "white" }} fontSize="small" />
            ) : (
              <TuneIcon style={{ color: "#333fa1" }} fontSize="small" />
            )}
            <Typography
              align="center"
              variant="subtitle2"
              className="ml-1"
              style={whatIfExpanded ? { color: "white" } : { color: "#333fa1" }}
            >
              What-If?
            </Typography>
          </ButtonMUI> 
        </ButtonGroup>
      </Grid> */}

      {/* Handling th Back button */}

      <Collapse in={whyExpanded} className={classes.collapse}>
        {whyShow && (
          <Grid className="d-flex justify-content-start ">
            <ButtonMUI
              variant="outlined"
              color="primary"
              onClick={() => {
                setWhyShow(false);
                setWhyExpanded(!whyExpanded);
              }}
            >
              <ArrowBackIosIcon style={{ color: "#333fa1" }} fontSize="small" />
              <Typography align="center" variant="subtitle2">
                Back
              </Typography>
            </ButtonMUI>
          </Grid>
        )}

        {/* Why visualizations */}
        <Grid container className={classes.root} spacing={0}>
          <Seperator Label="Why this publication?" Width="170" />
          <Grid item xs={12}>
            <Typography align="left" variant="subtitle2" className="ml-4">
              The Word cloud diagram shows the extracted keywords from this
              publication.
              <br />
              Hover over each keyword to see its similarity to
              <Typography
                className={classes.italicSubtitle2}
                variant="subtitle2"
                component="span"
              >
                Your Interests
              </Typography>
            </Typography>
          </Grid>
          <WhyExplanation index={index} paper={paper} interests={interests} />
          <Grid item xs={12} className={classes.collapseButton}>
            <ButtonMUI
              variant={howExpanded ? "contained" : "outlined"}
              color="primary"
              size="small"
              className="m-2"
              onClick={() => {
                setHowExpanded(!howExpanded);
              }}
            >
              {howExpanded ? (
                <AccountTreeIcon style={{ color: "white" }} fontSize="small" />
              ) : (
                <AccountTreeIcon
                  style={{ color: "#333fa1" }}
                  fontSize="small"
                />
              )}
              <Typography
                align="center"
                variant="subtitle2"
                className="ml-1"
                style={howExpanded ? { color: "white" } : { color: "#333fa1" }}
              >
                How?
              </Typography>
            </ButtonMUI>{" "}
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
              variant="outlined"
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
          {/* Jaleh */}
          <Grid container>
            <Grid
              item
              md={12}
              style={{
                borderBottom: "1px solid #2d3985",
                borderColor: "#2d3985",
                alignContent: "center",
                margin: "0px 10px 15px 10px",
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
              {/* <WhatIfInterests
                paper={paper}
                interests={interests}
                index={index}
                threshold={threshold}
                handleApplyWhatIfChanges={props.handleApplyWhatIfChanges}
              /> */}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <WhatIfKeywords
                paper={paper}
                interests={interests}
                index={index}
                threshold={threshold}
                handleApplyWhatIfChanges={props.handleApplyWhatIfChanges}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Collapse>
    </>

    // Tannaz end
  );
}
