import React, {useState} from "react";
import {Box, CircularProgress, Grid, makeStyles, Paper, Tab, Tabs, TextField, Typography} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import RestAPI from "../../../Services/api";
import {handleServerErrors} from "../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import RecentInterestComparison from "./RecentInterestComparison/RecentInterestComparison";
import InterestOverviewComparison from "./InterestOverviewComparison/InterestOverviewComparison";
import InterestTrendsComparison from "./InterestTrendsComparison/InterestTrendsComparison";
import SearchUserProfile from "./SearchUserProfile";


const useStyles = makeStyles(theme => ({
  padding: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
  gutterLarge: {
    margin: theme.spacing(3, 0, 6, 0)
  },
  tabPanel: {
    // backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main,

  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(4),
    marginBottom: 24
  },
  cardHeightAlt: {
    height: "100%",
    padding: theme.spacing(4, 4, 0, 4),
    // borderRadius: theme.spacing(4, 4, 0, 0),
    borderRadius: theme.spacing(4),
    marginBottom: 24
  },
}));


export default function CompareAuthors() {
  const [suggestions, setSuggestions] = useState([]);
  const [values, setValues] = useState(undefined);
  const [compareAuthor, setCompareAuthor] = useState(undefined);
  // const [compareAuthor, setCompareAuthor] = useState({
  //   email: "ulrich@gmail.com",
  //   first_name: "Ulrich",
  //   last_name: "Hoppe",
  //   id: 22,
  //   twitter_account_id: "@UCSM_UDE",
  //   author_id: "1724546",
  //   paper_count: 77,
  //   tweet_count: 21,
  // });
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const loading =
    <Grid container direction="column" justify="center" alignItems="center" className={classes.padding}>
      <Grid item>
        <CircularProgress/>
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>

  const handleSearchAuthors = (event, values) => {
    if (values.replace(/\s+/g, '').length > 1) {
      RestAPI.searchAuthors(values).then(res => {
        setSuggestions(res.data);
      })
    } else {
      setSuggestions([]);
    }
  };


  const handleSelectAuthorComparison = (event, values) => {
    setSuggestions([]);
    setValues(undefined);
    if (values !== null) {
      RestAPI.getScore(values.id).then(res => {
        // console.log(res.data)
        setValues({...res.data})
      }).catch(err => handleServerErrors(err, toast.error));

      RestAPI.getUserProfile(values.id).then(res => {
        // console.log(res.data)
        setCompareAuthor({...res.data});
      }).catch(err => handleServerErrors(err, toast.error))
    }

  }


  return (
    <>
      <Grid container component={Paper} className={classes.cardHeight}>
        <Grid item xs>
          <Typography variant="h5" gutterBottom>
            Compare Authors
          </Typography>
          <Typography className={classes.gutter}>
            Search for authors and compare interests
          </Typography>

          <Autocomplete
            options={suggestions}
            onInputChange={handleSearchAuthors}
            onChange={handleSelectAuthorComparison}
            getOptionLabel={(option) => option.first_name + " " + option.last_name}
            renderInput={(params) => <TextField {...params} label="Type an author's name" variant="outlined"/>}
            className={classes.gutter}
          />
        </Grid>
      </Grid>

      {values === undefined ? <></>


        : <>
          <Grid container direction="column" component={Paper} className={classes.cardHeightAlt} alignItems="center">
            <Grid item xs className={classes.gutterLarge}>
              <Typography variant="h4">
                Similarity score between you
                and {compareAuthor.first_name} {compareAuthor.last_name} is <b>{values.score}%</b>.
              </Typography>
            </Grid>

            <Grid container>
              <Grid item xs>
                <Tabs
                  value={value}
                  onChange={handleChangeTab}
                  variant="fullWidth"
                  aria-label="simple tabs example"
                  className={classes.tabPanel}
                >
                  <Tab label={<Typography variant="h6"><b> Interest Overview Comparison </b></Typography>}/>
                  <Tab label={<Typography variant="h6"><b> Explanations </b></Typography>}/>
                </Tabs>
              </Grid>
            </Grid>

          </Grid>


          {value === 0 ?
            <>
              <InterestOverviewComparison
                classes={classes}
                compareAuthor={compareAuthor}
              />

              <RecentInterestComparison
                classes={classes}
                loading={loading}
                compareAuthor={compareAuthor}
              />

              <InterestTrendsComparison
                classes={classes}
                compareAuthor={compareAuthor}
              />
            </> :
            <>
              <SearchUserProfile compareAuthor={compareAuthor}/>
            </>}
        </>

      }


    </>
  );
}
