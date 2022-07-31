import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EmbeddingLegends from "./EmbeddingLegends";

const textMetrics = require("text-metrics");
const el = document.querySelector("h5");
const metrics = textMetrics.init(el);

import {   
    Typography,
    Tabs,
    Tab,
    Box,

     } from "@material-ui/core";
import PropTypes from 'prop-types';
import HowStep from "./HowStep";
import HowFinalStep from "./HowFinalStep";
import HowOverview from "./HowOverview";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    display: "flex !important",
    justifyContent: "space-evenly !important",
  },  
  TabPanel: {
    width: "100%",

  },
  collapseButton: {
    width: "100px",
    display: "flex",
      justifyContent: "flex-end",
    },
    checkboxLabel: {
      fontSize:"16pt"
      },

}));
  

export default function HowExplanation(props) {


    {/*-----Tannaz-start---*/}
    const classes = useStyles();

    // states
      const [state, setState] = useState({
        paper: props.paper,
        interests: props.interests,
        index: props.index,
    })
  
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <>
      <Tabs
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        disableFocusRipple="true"
        disableRipple="true"
        centered
      >
        <Tab label="OVERVIEW" {...a11yProps(0)} />
        <Tab label="GET USER INTERESTS AND PUBLICATION KEYWORDS / KEYPHRASES" {...a11yProps(1)} />
        <Tab label="GENERATE EMBEDDINGS" {...a11yProps(2)} />
        <Tab label="COMPUTE SIMILARITY" {...a11yProps(3)} />
        </Tabs>
        <TabPanel style={{width:"70%"}} value={value} index={0}>
            <HowOverview paper={state.paper}  />
            <EmbeddingLegends />
        </TabPanel>
        {/*-----hoda-start---*/}
        <TabPanel style={{width:"70%"}} value={value===1 || value===2?1:value} index={1}>
          <HowStep
              interests={state.interests}
              keywords={state.paper.keyword}
              inclEmbedding={value===2}
            />
          <EmbeddingLegends />
        </TabPanel>
        <TabPanel  style={{width:"70%"}} value={value} index={3}>
          <HowFinalStep paper={state.paper} />
          <EmbeddingLegends />
        </TabPanel>
        {/*-----hoda-end---*/}
      </>
    );

        {/*-----Tannaz-end---*/}

    }



