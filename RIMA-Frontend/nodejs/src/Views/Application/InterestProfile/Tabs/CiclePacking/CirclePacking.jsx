import React, {useEffect, useState} from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import EditIcon from "@material-ui/icons/Edit";
import WhyInterest from "../../WhyInterest/WhyInterest";
import {ResponsiveCirclePacking} from "@nivo/circle-packing";
import SimiliarInterests from "../SimiliarInterests";


const CirclePacking = (props) => {
  const {keywords, setWordCloudInterest, setOpen} = props;
  const [openSimiliar, setOpenSimiliar]= useState(false)

  const [interests, setInterests] = useState([]);
  const [state, setState] = useState({
    openMenu: null,
    openWhyInterest: false,
    currentInterest: ""
  })

  useEffect(() => {
    let tempInterests = [];
    keywords.forEach((keyword) => {
      tempInterests.push({
        ...keyword,
        name: keyword.text,
        loc: keyword.value,
      });
    });
    setInterests(tempInterests);
  }, []);

  const handleWordClicked = (word, event) => {
    setState({
      ...state,
      openMenu: event.currentTarget,
      currentInterest: word.data
    })

  };

  const handleCloseMenu = () => {
    setState({
      ...state,
      openMenu: null
    });
  }

  const handleToggleWhyInterest = () => {
    setState({
      ...state,
      openMenu: null,
      openWhyInterest: !state.openWhyInterest
    });
  }

  const handleToggleEditInterest = () => {
    setState({
      ...state,
      openMenu: null,
    });
    setOpen(prevState => !prevState);
    setWordCloudInterest(state.currentInterest);
  }

  const handleToggleSimiliarInterest=()=>{
    setState({
      ...state,
      openMenu: null,
    });
    setOpenSimiliar(!openSimiliar);
    setWordCloudInterest(state.currentInterest)
  }


  return (
    <>
      {!interests ? (
        <>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <CircularProgress/>
            </Grid>
            <Grid item>
              <Typography variant="overline"> Loading data </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <div style={{width: 500, height: 500, margin: "auto"}}>
            <ResponsiveCirclePacking
              data={{children: interests}}
              margin={{top: 20, right: 20, bottom: 20, left: 20}}
              id="name"
              value="loc"
              colors={{scheme: "blues"}}
              colorBy="id"
              childColor={{from: "color", modifiers: [["brighter", 3]]}}
              padding={4}
              enableLabels={true}
              labelsSkipRadius={10}
              labelTextColor={{from: "color", modifiers: [["darker", 2]]}}
              borderWidth={1}
              borderColor={{from: "color", modifiers: [["darker", 0.5]]}}
              defs={[{id: "lines", background: "none", color: "inherit", rotation: -45, lineWidth: 5, spacing: 8}]}
              fill={[{match: {depth: 1,}, id: "lines"}]}
              onClick={handleWordClicked}
            />
          </div>
        </>
      )}

      <Menu open={Boolean(state.openMenu)} anchorEl={state.openMenu} onClose={handleCloseMenu}
            anchorOrigin={{vertical: 'center', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'center'}}>
        <MenuItem onClick={handleToggleSimiliarInterest}>
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

        <MenuItem onClick={handleToggleEditInterest}>
          <ListItemIcon>
            <EditIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">
            Edit
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={state.openWhyInterest} fullWidth={true} maxWidth="lg">
        <DialogTitle>
          Why this interest?
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0}>
            <Grid container>
              <Grid item xs={12}>
                {state.currentInterest.papers !== 0 ?
                  <WhyInterest papers={state.currentInterest.papers}
                               originalKeywords={state.currentInterest.originalKeywords}/>
                  : <Typography>The interest {state.currentInterest.text} has been added manually.</Typography>}
              </Grid>
            </Grid>

          </Paper>
        </DialogContent>

        <DialogActions style={{padding: 16}}>
          <Button onClick={handleToggleWhyInterest} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>

      </Dialog>
      <Dialog open={openSimiliar} fullWidth={true} maxWidth="lg" onClose={handleToggleSimiliarInterest}>
        <DialogTitle>Similiar Interests to {state.currentInterest.text}</DialogTitle>
        <DialogContent>
          <SimiliarInterests interest={[state.currentInterest.text]}/>

        </DialogContent>
        <DialogActions style={{padding: 16}}>
          <Button onClick={handleToggleSimiliarInterest} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CirclePacking;
