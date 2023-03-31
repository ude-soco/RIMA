import React, {useEffect, useState} from "react";

import {Button, Checkbox, CircularProgress, Grid, Menu, MenuItem, Typography} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import NodeLink from "./GetNodeLinkExplore";
import RestAPI from "../../../../../Services/api";


const Explore = (props) => {
  const {data, interests, setInterests, setData}=props
  //let checked = [];
  //let nodeData = [];
  //const [data, setData] = useState([])
  const [changeInterest, setChangeInterest] = useState(false);
  const [state, setState] = useState({
    openMenu: null,
    checked: [],
    graphData: null,
    interests: []
  });
  const [keywords, setKeywords] = useState([]);

  const [checkNewKeywords, setCheckNewKeywords] = useState(false)

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  const fetchKeywords = async () => {
    //setState({...state,userInterests: []})
    const response = await RestAPI.longTermInterest(currentUser);
    const {data} = response;
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
    setKeywords(dataArray);
    console.log(curInterests, "test fetch")
    return curInterests

  };


  const compareInterests = async () => {
    setCheckNewKeywords(false)
    let curInterests = await fetchKeywords()
    let oldInterests = interests

    if (curInterests) {
      if(curInterests.toString()!==interests.toString()){
        setState({...state, checked: [], graphData: null})
        setInterests(false)
        setData(false)
        setCheckNewKeywords(false)
        let curData = data


        console.log(interests, "data missing interests")
        console.log(curInterests, "data missing curInterests")
        let missingInterests = curInterests.filter((i)=>
        {return !oldInterests.includes(i)})
        console.log(missingInterests, "data missing")
        //missingInterests=missingInterests.slice(0,2)
        let deletedInterests = oldInterests.filter((i)=>{
          return !curInterests.includes(i)
        })

        if (deletedInterests.length>0){
          curData.forEach((x,i)=>{
            console.log(x, i, "delete interests")
            let deltedInterest=x.title
            deltedInterest=deltedInterest.toLowerCase()
            if(deletedInterests.includes(deltedInterest)){
              console.log(x, i, "delete interests")
              curData.splice(i,1)
            }
          })
          /*deletedInterests.forEach((x, i)=>{
            console.log(x, i, "delete interests")
            //delete curData[i]

          })*/
        console.log(curData, "deleted interests data")

        }

        if (missingInterests.length > 0){

          RestAPI.getExploreData(missingInterests).then(res=>{
            const {data}=res
            console.log(curData, "data cur Data ")
            let newData = data.data
             newData=newData.concat(curData)

            console.log(newData, "data Explore")

            //setInterests(curInterests)
            setInterests(curInterests)
            setData(newData)

            console.log("data new interests", Object.keys(newData))

            console.log("done data Explore", newData)

          })
        }
        else{
          setInterests(curInterests)
          setData(curData)
        }
        setCheckNewKeywords(true)
      }
      else{
        setCheckNewKeywords(true)
        setInterests(curInterests)
      }


    }


  }
 useEffect(() => {
    //let curInterests= fetchKeywords()
    if(data){
      setState({...state, graphData:null})
      compareInterests()
    }


  }, [])



  useEffect(() => {
    console.log("data useEffectt", data)
    setCheckNewKeywords(false)

    let newChecked=[]
    let nodeData=[]
      if(data) {
        setState({...state,  graphData: null})
          compareInterests().then(res=>{

            data.map((d, index) => {
              console.log(d, "data map interests explore.py")
              if (index < 3) {
                newChecked.push(true);
                nodeData.push(d);
                console.log(nodeData, newChecked, "nodedata")
              } else {
                newChecked.push(false);
              }

            });
            console.log(nodeData, newChecked, "nodedata")
            setState({...state, checked: newChecked, graphData: nodeData});

          })


    }

  }, [data])



  useEffect(() => {
    setChangeInterest(true);
    console.log(state, "change checked")
  }, [state.checked]);

  const handleOpenMenu = (event) => {
    setState({...state, openMenu: event.currentTarget});
  };
  const handleCloseMenu = () => {
    setState({...state, openMenu: null});
  };

  const handleCheck = (index) => {
    let checkedNew = state.checked;
    let newNodeData = [];

    checkedNew[index] = !checkedNew[index];
    console.log("data interests explore.py")

    data.map((d, i) => {
      if (checkedNew[i]) {
        console.log("data interests explore.py", d, i)
        newNodeData.push(d);
      }
    });

    setState({...state, checked: checkedNew, graphData: newNodeData});
  };
  return (

    <>
      <Grid container justify="flex-end" style={{paddingTop: 24, paddingBottom: 8}}>
        <Button startIcon={<FilterListIcon/>} color="primary" onClick={handleOpenMenu}>
          Filter interests
        </Button>
        {data?<Menu
            id="filterInterestExplore"
            anchorEl={state.openMenu}
            keepMounted
            open={Boolean(state.openMenu)}
            onClose={handleCloseMenu}
        >
          {state.checked.length > 0 ? data.map((d, index) => {
            let isChecked = state.checked[index];

            return (
                <MenuItem>
                  <Checkbox
                      checked={isChecked}
                      keyCheck={index}
                      onChange={() => handleCheck(index)}
                  />
                  {d.title}
                </MenuItem>
            );
          }) : <></>}
        </Menu>:<></>}
      </Grid>
      <Grid container>
        <Grid item xs={1}/>
        <Grid item xs={10}>
          {data ? <NodeLink data={state.graphData} keywords={keywords}/> : <Loading/>}
        </Grid>
        <Grid item xs={1}/>
      </Grid>
    </>

  );
};

export default Explore;

export const Loading = () => {
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <CircularProgress/>
        </Grid>
        <Grid item>
          <Typography variant="overline"> Loading data </Typography>
        </Grid>
      </Grid>
    </>
  )
}
