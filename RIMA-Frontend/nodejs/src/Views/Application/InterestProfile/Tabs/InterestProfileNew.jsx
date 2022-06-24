import * as React from "react";
import {useState} from "react";
import {Box, Divider, Paper, Tab, Tabs, Typography,} from "@material-ui/core";
import MyInterests from "./MyInterests";

import HowDoesItWork from "./HowDoesItWork";
import Connect from "./Connect";
import HorizontalFlow from "./Explore";
import Discover from "./Discover";

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function InterestProfileTabs({classes}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.cardHeight} style={{flexGrow: 1}}>
      <Tabs
        value={value}
        indicatorColor="secondary"
        onChange={handleChange}
        centered
      >
        <Tab label="My Interests"/>
        <Tab label="Explore"/>
        <Tab label="Discover"/>
        <Tab label="Connect"/>
        <Tab label="How does it work?"/>
      </Tabs>
      <Divider/>
      <TabPanel value={value} index={0}>
        <MyInterests/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HorizontalFlow/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Discover/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Connect/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HowDoesItWork/>
      </TabPanel>
    </Paper>
  );
}
