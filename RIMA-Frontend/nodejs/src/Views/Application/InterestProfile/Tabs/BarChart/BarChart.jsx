import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  MenuItem, ListItemIcon, Menu, Paper, IconButton
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";
import WhyInterest from "../../WhyInterest/WhyInterest";
import CloseIcon from "@material-ui/icons/Close";


// changed the original Class component to a functional component - Clara
const BarChart = (props) => {
  const { keywords, handleClickPopOver, id, setCurrInterest} = props;

  const [interests, setInterests] = useState([]);
  const [weights, setWeights] = useState([]);

  const [state, setState] = useState({
    openMenu: null,
    openWhyInterest: false,
    currentInterest: ""
  })

  const handleCloseMenu = () => {
    setState({...state, openMenu: null})
  }
  const handleToggleWhyInterest = () => {
    setState({
      ...state,
      openMenu: null,
      openWhyInterest: !state.openWhyInterest
    });
  }


  useEffect(() => {
    let tempInterests = [];
    let tempWeights = [];
    keywords.forEach((keyword) => {
      tempInterests.push(keyword.text);
      tempWeights.push(keyword.value);
    });
    setInterests(tempInterests);
    setWeights(tempWeights);

  }, []);





  // The styling of the bar chart - Clara
  const options = {
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          setState({
            ...state,
            openMenu: event.currentTarget,
            currentInterest: keywords[config.dataPointIndex]
          })



          // Can define at this point what happens when the user clicks on a bar - Alptug
        },
      },
    },
    xaxis: {
      title: { text: "Interests" },
      //what are the interests, fetched as keywords from the user model - Clara
      categories: interests,
    },
    yaxis: { title: { text: "Weight of interests" } },
  };
  // console.log(options, "test");
  const series = [
    {
      name: "Interests",
      //the value of the bars, fetched as the weights from the keywords - Clara
      data: weights,
    },
  ];
  // console.log(options, "data");
  return (
    <>
      {!interests ? (
        <>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <CircularProgress />
            </Grid>
            <Grid item>
              <Typography variant="overline"> Loading data </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Chart options={options} series={series} type="bar" width="700" aria-describedby={id}  />
        </>
      )}

      <Menu open={Boolean(state.openMenu)} anchorEl={state.openMenu} onClose={handleCloseMenu}
            anchorOrigin={{vertical: 'center', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'center'}}>
        <MenuItem>
          <ListItemIcon>
            <SearchIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">
            Similar Interests
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleToggleWhyInterest}>
          <ListItemIcon>
            <HelpOutlineIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">
            Why this Interest
          </Typography>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">
            Edit
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={state.openWhyInterest} fullWidth={true}>
        <DialogContent>
          <Paper elevation={0}>
            <Grid container alignItems="center">

              <Grid item xs={11}>
                <Typography variant="h6" style={{textTransform: "capitalize"}}> Why this
                  interest? </Typography>
              </Grid>
              <Grid item xs={1} >
                <IconButton onClick={handleToggleWhyInterest}> <CloseIcon fontSize="small"/> </IconButton>
              </Grid>


            </Grid>
            <Grid container >
              <Grid item xs={12}>
                {state.currentInterest.papers !=0?
                    <WhyInterest
                        papers={state.currentInterest.papers}
                    />:
                    <Typography>The interest {state.currentInterest.text} has been added manually.</Typography>}

              </Grid>
            </Grid>

          </Paper>
        </DialogContent>

      </Dialog>
    </>
  );
};

export default BarChart;
