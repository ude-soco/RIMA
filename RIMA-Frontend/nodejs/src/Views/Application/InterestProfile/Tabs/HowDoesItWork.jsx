import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";


import {Box, Tab, Tabs, Typography} from "@material-ui/core";
import HowStep1 from "../HowSteps/HowStep1";
import HowStep2 from "../HowSteps/HowStep2";
import HowStep3 from "../HowSteps/HowStep3";
import HowStep4 from "../HowSteps/HowStep4";
import HowStep5 from "../HowSteps/HowStep5";
import RestAPI from "../../../../Services/api";


function TabPanel(props) {
  const {children, value, index, ...other} = props;

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

export default function HowDoesItWork() {
  const [value, setValue] = React.useState(0);
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    fetchKeywords().then().catch(err => console.log(err))
  }, []);

  const fetchKeywords = async () => {
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    setKeywords([]);
    const response = await RestAPI.longTermInterest(currentUser);
    const {data} = response;
    let dataArray = [];
    data.forEach((d) => {
      const {id, categories, original_keywords, original_keywords_with_weights, source, keyword, weight, papers} = d;
      let newData = {
        id: id,
        categories: categories,
        originalKeywords: original_keywords,
        originalKeywordsWithWeights: original_keywords_with_weights,
        source: source,
        text: keyword,
        value: weight,
        papers: papers,
      };
      dataArray.push(newData);
    });
    setKeywords(dataArray);
    return dataArray;
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <Box style={{display: "flex", height: "70vh"}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        indicatorColor="primary"
        onChange={handleChange}
        style={{
          borderRight: `1px solid #e4e4e4`,
          display: "flex !important",
          justifyContent: "space-evenly !important"
        }}
      >
        <Tab label="Step 1"/>
        <Tab label="Step 2"/>
        <Tab label="Step 3"/>
        <Tab label="Step 4"/>
        <Tab label="Step 5"/>
      </Tabs>
      <TabPanel value={value} index={0}>
        <HowStep1/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HowStep2/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HowStep3 keywords={keywords}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HowStep4 keywords={keywords}/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HowStep5 keywords={keywords}/>
      </TabPanel>
    </Box>

  );
}
