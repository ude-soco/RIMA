import React, { useState, useEffect } from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Grid, IconButton,
  ListItemIcon,
  Menu,
  MenuItem, Paper,
  Typography
} from "@material-ui/core";
import MyResponsiveCirclePacking from "./MyResponsiveCirclePacking";
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import WhyInterest from "../../WhyInterest/WhyInterest";


export default function CirclePacking(props) {
  const { keywords } = props;

  const [interests, setInterests] = useState([]);
  const [state, setState] = useState({
    openMenu: null,
    openWhyInterest: false,
    currentInterest: ""
  })

  const handleWordClicked = (word, event) => {
    let interest = {}
    keywords.map((i)=>{
      if(i.text == word.id){
        interest = i;
      }
    })
    setState({
      ...state,
      openMenu: event.currentTarget,
      currentInterest: interest
    })
    console.log("test word", word, event, interest);
  };

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
    keywords.forEach((keyword) => {
      tempInterests.push({
        name: keyword.text,
        loc: keyword.value,
      });
    });
    setInterests(tempInterests);
  }, []);

  return (
    <>
      {!interests ? (
        <>
          <Grid
            container
            direction="column"
            justifyContent="center"
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
          <div style={{ width: 500, height: 500, margin: "auto" }}>
            <MyResponsiveCirclePacking data={{ children: interests }} handleWordClicked={handleWordClicked}  />
          </div>
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
}
