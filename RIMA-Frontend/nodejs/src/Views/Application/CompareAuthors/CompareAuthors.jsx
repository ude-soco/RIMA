import React, {useState} from "react";
import {Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
import {getItem} from "../../../Services/utils/localStorage";
import axios from "axios";
import {BASE_URL} from "../../../Services/constants";
import Autocomplete from '@material-ui/lab/Autocomplete';
import RestAPI from "../../../Services/api";
import {handleServerErrors} from "../../../Services/utils/errorHandler";
import {toast} from "react-toastify";
import ComparisonSlider from "./ComparisonSlider";

const useStyles = makeStyles(theme => ({
  padding: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  gutter: {
    marginBottom: theme.spacing(2)
  },
}));


export default function CompareAuthors() {
  const [suggestions, setSuggestions] = useState([]);
  const [values, setValues] = useState(undefined);
  const [compareAuthor, setCompareAuthor] = useState(undefined);


  const classes = useStyles();

  const handleSearchAuthors = (event, values) => {
    if (values.replace(/\s+/g, '').length > 1) {
      getInfo(values);
    } else {
      setSuggestions([]);
    }
  };


  const handleSelectAuthorComparison = (event, values) => {
    setSuggestions([]);
    RestAPI.getScore(values.id).then(res => {
      // console.log(res.data)
      setValues({...res.data})
    }).catch(err => handleServerErrors(err, toast.error));

    RestAPI.getUserProfile(values.id).then(res => {
      // console.log(res.data)
      setCompareAuthor({...res.data});
    }).catch(err => handleServerErrors(err, toast.error))
  }


  const getInfo = (v) => {
    const TOKEN = getItem("accessToken");
    axios({
      method: "get",
      url: `${BASE_URL}/api/accounts/user-search/${v}/`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${TOKEN}`,
      },
    }).then(({data}) => {
      setSuggestions(data);
    });
  };

  return (
    <>
      <Grid container component={Paper} className={classes.padding}>
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

      {values === undefined ? <></> : <>
        <Grid container component={Paper} className={classes.padding} justify="center">
          <Grid item>
            <Typography variant="h5" className={classes.gutter}>
              Similarity score between you and {compareAuthor.first_name} {compareAuthor.last_name} is {values.score}%.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ComparisonSlider
              first_name={compareAuthor.first_name}
              last_name={compareAuthor.last_name}
            />
          </Grid>
        </Grid>
      </>
      }


    </>
  );
}
