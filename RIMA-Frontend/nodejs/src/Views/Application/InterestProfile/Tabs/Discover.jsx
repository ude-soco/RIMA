import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import React, {useEffect, useState} from "react";
import GetNodeLink from "./GetNodeLinkDiscover";
import RestAPI from "../../../../Services/api";


const DiscoverPage = () => {
  const [interests, setInterests] = useState([]);
  const [state, setState] = useState({
    openInterest: null,
    openCategory: null,
    currCategoriesLabel: [],
    currCategoriesValue: false,
    currInterestData: null,
    currInterest: false,
    currData: []
  });
  const [data, setData] = useState()
  const [keywords, setKeywords] = useState([]);

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  const fetchKeywords = async () => {
    //setState({...state,userInterests: []})
    const response = await RestAPI.longTermInterest(currentUser);
    const {data} = response;
    let dataArray = [];
    let interests = []
    data.map((d) => {
      //console.log(d, "test")
      interests.push(d.keyword)
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
    console.log(interests, "test fetch")
    setInterests(interests)
    return interests

  };

  const getData = async () => {
    let interests = await fetchKeywords()
    if (interests) {
      console.log("started Data")
      const response = await RestAPI.getDiscoverData(interests)
      const {data} = response
      setData(data.data)
      console.log("test data", data)

    }


  }
  useEffect(() => {
    getData()
  }, [])


  useEffect(() => {
    console.log(data, "test data")
    if (data) {
      let currLabels = [];
      let currValues = [];

      let currData = data[interests[0]];

      currData.map((d, index) => {
        currLabels.push(d.topic);
        if (index < 3) {
          currValues.push(true);
        } else {
          currValues.push(false);
        }
      });

      setState({
        ...state,
        currInterest: interests[0],
        currData: currData,
        currCategoriesLabel: currLabels,
        currCategoriesValue: currValues
      });

    }

  }, [data]);

  useEffect(() => {
    let currLabels = [];
    let currValues = [];
    let categories = state.currData;

    categories.map((c, index) => {
      currLabels.push(c.topic);
      if (index < 3) {
        currValues.push(true);
      } else {
        currValues.push(false);
      }
      setState({
        ...state,
        currCategoriesLabel: currLabels,
        currCategoriesValue: currValues
      });
    });
  }, [state.currData]);

  useEffect(() => {
    if (state.currInterest) {
      let d = data[state.currInterest];

      setState({...state, currData: d});
    }
  }, [state.currInterest]);

  const handleOpenInterest = (event) => {
    setState({...state, openInterest: event.currentTarget});
  };
  const handleCloseInterest = () => {
    setState({...state, openInterest: null});
  };

  const handleOpenCategory = (event) => {
    setState({...state, openCategory: event.currentTarget});
  };
  const handleCloseCategory = () => {
    setState({...state, openCategory: null});
  };

  const handleInterest = (event) => {
    setState({...state, currInterest: event.target.value});
  };

  const handleCheck = (target) => {
    let currCategories = state.currCategoriesLabel;
    let currIndex = currCategories.indexOf(target);
    let currValuesCategories = state.currCategoriesValue;
    currValuesCategories[currIndex] = !currValuesCategories[currIndex];

    setState({...state, currCategoriesValue: currValuesCategories});
  };

  return (
    <>
      <Grid container justify="flex-end" style={{paddingTop: 24, paddingBottom: 8}}>
        <Button startIcon={<FilterListIcon/>} color="primary" onClick={handleOpenInterest}>
          Choose interest
        </Button>
        <Menu
          id="currInterestDiscover"
          anchorEl={state.openInterest}
          keepMounted
          open={Boolean(state.openInterest)}
          onClose={handleCloseInterest}
        >
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              style={{paddingLeft: "8px", paddingTop: "8px"}}
            >
              Interest
            </FormLabel>
            <RadioGroup
              aria-label="interest"
              name="interest"
              value={state.currInterest}
              onChange={handleInterest}
              style={{padding: "8px"}}
            >
              {interests.map((s) => {
                return (
                  <FormControlLabel value={s} control={<Radio/>} label={s}/>
                );
              })}
            </RadioGroup>
          </FormControl>
        </Menu>
        <Button startIcon={<FilterListIcon/>} color="primary" onClick={handleOpenCategory} style={{marginLeft: 8}}>
          Field of Study
        </Button>
        <Menu
          id="filterInterestExplore"
          anchorEl={state.openCategory}
          keepMounted
          open={Boolean(state.openCategory)}
          onClose={handleCloseCategory}
        >
          {state.currCategoriesLabel.map((cat, index) => {
            let label = cat;
            let check = state.currCategoriesValue[index];
            return (
              <MenuItem>
                <Checkbox
                  checked={check}
                  keyCheck={index}
                  onChange={() => handleCheck(label)}
                />
                {label}
              </MenuItem>
            );
          })}
        </Menu>
      </Grid>
      <Grid container>
        <Grid item xs={1}/>
        <Grid item xs={10}>
          {state.currCategoriesValue ? (
            <GetNodeLink
              interest={state.currInterest}
              categoriesChecked={state.currCategoriesValue}
              data={state.currData}
              keywords={keywords}
            />
          ) : (
            <Loading/>
          )}
        </Grid>
        <Grid item xs={1}/>
      </Grid>
    </>
  );
};

export default DiscoverPage;

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