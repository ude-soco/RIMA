import React, {useState} from "react";
import ReactWordcloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import {
  Button,
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

const WordCloud = (props) => {
  const {keywords} = props;

  const [state, setState] = useState({
    openMenu: null,
    openWhyInterest: false,
    currentInterest: ""
  })

  const handleWordClicked = (word, event) => {
    setState({
      ...state,
      openMenu: event.currentTarget,
      currentInterest: word
    })
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

  return (
    <Grid container style={{width: "800px"}}>
      <ReactWordcloud
        words={keywords}
        options={{
          colors: [
            "#b39ddb",
            "#7e57c2",
            "#4fc3f7",
            "#03a9f4",
            "#0288d1",
            "#01579b",
          ],
          enableTooltip: true,
          deterministic: true,
          fontFamily: "helvetica",
          fontSizes: [14, 64],
          fontStyle: "normal",
          fontWeight: "normal",
          padding: 3,
          rotations: 1,
          rotationAngles: [0, 90],
          scale: "sqrt",
          spiral: "archimedean",
          transitionDuration: 1000,
        }}
        callbacks={{
          onWordClick: (word, event) => handleWordClicked(word, event),
          getWordTooltip: (word) =>
            `${
              word.source === "Scholar"
                ? "Extracted from publications"
                : word.source === "Twitter"
                  ? "Extracted from tweets"
                  : word.source === "Manual"
                    ? "Manually added"
                    : "Extracted from publications & tweets"
            }`,
        }}
      />

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

      <Dialog open={state.openWhyInterest} fullWidth={true} maxWidth="lg">
        <DialogTitle>
            Why this interest?
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0}>
            <Grid container>
              <Grid item xs={12}>
                {(state.currentInterest.papers !== 0) ?
                  <WhyInterest papers={state.currentInterest.papers}/> :
                  <Typography>
                    The interest {state.currentInterest.text} has been added manually.
                  </Typography>}
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
    </Grid>
  );
};

export default WordCloud;
