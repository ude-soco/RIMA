import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";


import {Tab, Tabs, Typography, Box, Paper} from "@material-ui/core";
import HowStep1 from "../HowSteps/HowStep1";
import HowStep2 from "../HowSteps/HowStep2";
import HowStep3 from "../HowSteps/HowStep3";
import HowStep4 from "../HowSteps/HowStep4";
import HowStep5 from "../HowSteps/HowStep5";


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
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    display: "flex !important",
    justifyContent: "space-evenly !important"
  },
  TabPanel: {
    width: "50px"
  },
  collapseButton: {
    width: "100px",
    display: "flex",
    justifyContent: "flex-end"
  },
  checkboxLabel: {
    fontSize: "16pt"
  }
}));

export default function How() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

      <div className={classes.root} style={{ width: "1000px", padding:8, height:"600px" }}>
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
        >
          <Tab label="Provide Source of data" {...a11yProps(0)} />
          <Tab label="Collect Publications and Tweets" {...a11yProps(1)} />
          <Tab label="Extract Keywords" {...a11yProps(2)} />
          <Tab label="Generate Interest Profile" {...a11yProps(3)} />
          <Tab label="Visualize Interest profile" {...a11yProps(4)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <HowStep1/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <HowStep2/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <HowStep3/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <HowStep4/>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <HowStep5 />
        </TabPanel>
      </div>

  );
}
