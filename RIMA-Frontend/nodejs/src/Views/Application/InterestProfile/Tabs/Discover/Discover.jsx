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
import RestAPI from "../../../../../Services/api";


const DiscoverPage = (props) => {
  //const [interests, setInterests] = useState([]);
  const {data, interests, setInterests, setData}=props
  const [state, setState] = useState({
    openInterest: null,
    openCategory: null,
    currCategoriesLabel: [],
    currCategoriesValue: false,
    currInterestData: null,
    currInterest: false,
    currData: []
  });
  //const [data, setData] = useState()
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
        setData(false)
        setCheckNewKeywords(false)
        //setInterests(false)
        let curData = data


        console.log(interests, "data missing interests")
        console.log(curInterests, "data missing curInterests")
        let missingInterests = curInterests.filter((i)=>
        {return !oldInterests.includes(i)})
        console.log(missingInterests, "data missing")
        //missingInterests=[]
        let deletedInterests = oldInterests.filter((i)=>{
          return !curInterests.includes(i)
        })

        if (deletedInterests.length>0){
          deletedInterests.forEach((x, i)=>{

            delete curData[x]

          })



        }

        if (missingInterests.length > 0){

          RestAPI.getDiscoverData(missingInterests).then(res=>{
            const {data}=res
            console.log(curData, "data cur Data ")
            curData = {...curData, ...data.data}

            setInterests(curInterests)
            setData(curData)
            //console.log("data new interests", Object.keys(newData))

            console.log("done data Discover")

          })
        }
        else{
          setInterests(curInterests)
          setData(curData)
        }
       setCheckNewKeywords(true)

      }
      else {
        setCheckNewKeywords(true)
      }

    }




  }






  useEffect(() => {
      setCheckNewKeywords(false)
      if (data) {
        if(!checkNewKeywords){
          compareInterests()
          console.log(checkNewKeywords, "check new keywords")
          if(interests) {
            console.log(interests, "data interersts get data")
            console.log(data, "data discover ")
            //setInterests(interests)

            let currLabels = [];
            let currValues = [];

            let currData = data[interests[0]];

            try{
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
            catch{

              setState({
                ...state,
                currInterest: "",
                currData: "",
                currCategoriesLabel: false,
                currCategoriesValue: false
              });
            }


          }
        }


        //const response = await RestAPI.getDiscoverData(interests)
        //const {data} = response
        //setData(data.data)
        //console.log("test data", data)


      }
    console.log(checkNewKeywords, "check new keywords")





  }, [data]);

  useEffect(() => {
    let currLabels = [];
    let currValues = [];
    let categories = state.currData;
    try{
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
    }catch{
      setState({
        ...state,
        currCategoriesLabel: false,
        currCategoriesValue: false
      });
    }

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
            {interests?<RadioGroup
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
            </RadioGroup>:<></>}
          </FormControl>
        </Menu>
        <Button startIcon={<FilterListIcon/>} color="primary" onClick={handleOpenCategory} style={{marginLeft: 8}}>
          Field of Study
        </Button>
        {state.currCategoriesLabel?<Menu
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
        </Menu>:<></>}
      </Grid>
      <Grid container>
        <Grid item xs={1}/>
        <Grid item xs={10}>
          {checkNewKeywords ? (
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