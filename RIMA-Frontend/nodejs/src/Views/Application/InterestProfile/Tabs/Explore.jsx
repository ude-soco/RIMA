import React, {useEffect, useState} from "react";

import {Button, Checkbox, CircularProgress, Grid, Menu, MenuItem, Typography} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import NodeLink from "./GetNodeLinkExplore";
import RestAPI from "../../../../Services/api";


const ExplorePage = () => {
  let checked = [];
  let nodeData = [];
  const [data, setData] = useState([])
  const [changeInterest, setChangeInterest] = useState(false);
  const [state, setState] = useState({
    openMenu: null,
    checked: [false],
    graphData: null,
    interests: []
  });

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  const fetchKeywords = async () => {
    //setState({...state,userInterests: []})
    const response = await RestAPI.longTermInterest(currentUser);
    const {data} = response;

    let interests = []
    data.map((d) => {
      //console.log(d, "test")
      interests.push(d.keyword)
    })
    console.log(interests, "test fetch")
    setState({...state, userInterests: interests})
    interests = interests.slice(0, 1)
    return interests

  };

  const getData = async () => {
    let interests = await fetchKeywords()
    if (interests) {
      const response = await RestAPI.getExploreData(interests)
      const {data} = response
      setData(data.data)
      console.log("test data", data)
    }

  }
  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    data.map((d, index) => {
      if (index < 3) {
        checked.push(true);
        nodeData.push(d);
      } else {
        checked.push(false);
      }
    });
    setState({...state, checked: checked, graphData: nodeData});
  }, [data])

  useEffect(() => {
    setChangeInterest(true);
  }, [checked]);

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

    data.map((d, i) => {
      if (checkedNew[i]) {
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
        <Menu
          id="filterInterestExplore"
          anchorEl={state.openMenu}
          keepMounted
          open={Boolean(state.openMenu)}
          onClose={handleCloseMenu}
        >
          {state.graphData ? data.map((d, index) => {
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
        </Menu>
      </Grid>
      <Grid container>
        <Grid item xs={1}/>
        <Grid item xs={10}>
          {state.graphData ? <NodeLink data={state.graphData}/> : <Loading/>}
        </Grid>
        <Grid item xs={1}/>
      </Grid>
    </>

  );
};

export default ExplorePage;

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
