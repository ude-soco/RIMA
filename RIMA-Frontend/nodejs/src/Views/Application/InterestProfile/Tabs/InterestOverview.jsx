import React, {useState, useEffect} from "react";
import {Box, Divider, Paper, Tab, Tabs, Typography,} from "@material-ui/core";
import MyInterests from "./MyInterests/MyInterests";
import HowDoesItWork from "./HowDoesItWork/HowDoesItWork";
import Connect from "./Connect/Connect";
import Explore from "./Explore/Explore"
import Discover from "./Discover/Discover";
import RestAPI from "../../../../Services/api";
import { test } from "./Connect/ConnectedGraph";

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


export default function InterestOverview () {
  const [value, setValue] = useState(0);
    const [dataExplore, setDataExplore] = useState(false);
    const [dataDiscover, setDataDiscover] = useState(false);
    const [dataConnect, setDataConnect] = useState(false);
    const [interests, setInterests] =useState(false)
  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  console.log(currentUser, "data cur user")
    useEffect(() => {
        fetchData().then().catch(err => console.log(err))
    }, []);

    const fetchData = async () => {
        console.log("start collect data")
        setDataConnect([]);


        RestAPI.longTermInterest(currentUser).then(res=>{
            const {data} = res;
            let dataArray = [];
            let curInterests = []
            data.map((d) => {
                //console.log(d, "test")
                curInterests.push(d.keyword)
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
            })
            //setKeywords(dataArray);
            console.log(interests, "test fetch")
            //curInterests=curInterests.slice(0,2)
            setInterests(curInterests)

           RestAPI.getExploreData(curInterests).then(res=>{
                const {data}=res
                setDataExplore(data.data)
                console.log("done data Explore")
            }).catch(res=>{
                setDataExplore(["Sorry, we are experiencing an error"])
            })

           RestAPI.getDiscoverData(curInterests).then(res=>{
                const {data}=res
                setDataDiscover(data.data)
                console.log("done data Discover")
            }).catch(res=>{
                setDataDiscover(["Sorry, we are experiencing an error"])
            })

        console.log(test)     
        //let test = 5;
        RestAPI.getConnectData({data:currentUser.author_id, test}).then(res=>{
            const {data}=res
            setDataConnect(data.data)
        })

        
      


    })};



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper style={{flexGrow: 1, height: "100%", padding: 16, borderRadius: 16}}>
      <Tabs value={value} indicatorColor="primary" onChange={handleChange} centered>
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
        <Explore data={dataExplore} interests={interests}
                 setInterests = {setInterests} setData={setDataExplore}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Discover data={dataDiscover} interests={interests}
                  setInterests = {setInterests} setData={setDataDiscover}/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Connect data={dataConnect} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HowDoesItWork/>
      </TabPanel>
    </Paper>
  );
}
