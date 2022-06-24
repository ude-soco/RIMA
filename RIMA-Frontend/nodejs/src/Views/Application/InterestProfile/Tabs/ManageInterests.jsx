import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import * as React from "react";
import {useState} from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
import Slider from "@material-ui/core/Slider";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import AddIcon from "@material-ui/icons/Add";

const ManageInterests = (props) => {
  const {
    keywords,
    setKeywords,
    handleClose,
    ids,
    interestsWeights,
    setRememberDelete,
    allNewInterests,
    setAllNewInterests,
    setChangeInterests,
    handleIdsDelete,
  } = props;

  //handle PopUp
  const [interests, setInterests] = useState(keywords)
  const [editInterest, setEditInterest] = useState(false);
  const [enterInterest, setEnterInterest] = useState("");
  const [reset, setReset] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [buttonInterest, setButtonInterest] = React.useState(false);
  const [newInterest, setNewInterest] = React.useState("");
  const [newInterestWeight, setNewInterestWeight] = React.useState(2.5);
  const [inputNewInterest, setInputNewInterest] = React.useState("");
  const [defaultNewInterest, setDefaultNewInterest] = React.useState(2.5);

  // const handleClose = () => setOpen(false);

  const handleChange = (sliderId) => (e, value) => {
    //track changing slider values & apply as new value
    allNewInterests[sliderId]["weight"] = value;
    setAllNewInterests(allNewInterests);
    setChangeInterests(true);
    console.log(
      sliderId,
      "test handleChange",
      interestsWeights[sliderId]["weight"],
      allNewInterests[sliderId]["weight"]
    );
  };

  //delete interest
  const handleDelete = (name) => (e, value) => {
    const id = allNewInterests[name]["id"];
    const weight = allNewInterests[name]["weight"];
    delete allNewInterests[name];
    //remeber deleted interest
    setRememberDelete([name, weight, id]);
    setReset(false);
    setAllNewInterests(allNewInterests);
    handleIdsDelete(id);
    handleClose();
  };

  //changes value new interest
  const handleNewInterest = (e) => {
    setNewInterest(e.target.value);
    setInputNewInterest(e.target.value);
  };

  //changes new interest
  const handleChangeNewInterest = (e, value) => {
    setNewInterestWeight(value);
    setDefaultNewInterest(value);
  };

  const saveNewInterest = () => {
    //find not used ID
    const id = Math.max(...ids) + 1;
    //add new interest
    allNewInterests[newInterest] = {weight: newInterestWeight, id: id};
    setAllNewInterests(allNewInterests);
    setChangeInterests(true);
    //reset values
    setInputNewInterest("");
    setDefaultNewInterest(2.5);
  };

  //want to delete interest?
  const handleOpenConfirmation = (name) => () => {
    setOpen(true);
    setButtonInterest(name);
    handleDelete(name);
  };

  const handleInterestWeights = (event, value, interest) => {
    setInterests([]);
    let newInterests = interests;
    const index = newInterests.findIndex(i => i.id === interest.id);
    if (index !== -1) {
      newInterests[index].value = value
      if (enterInterest !== "") {
        newInterests[index].text = enterInterest
      }
    }
    setInterests(newInterests);
  }

  const handleChangeInterest = (event) => {
    const {target: {value}} = event;
    setEnterInterest(value)
  }

  const handleUpdateInterest = (interest) => {
    setInterests([]);
    let newInterests = interests;
    const index = newInterests.findIndex(i => i.id === interest.id);
    if (index !== -1) {
      if (enterInterest !== "") {
        newInterests[index].text = enterInterest
      }
    }
    setInterests(newInterests);
    setEditInterest(false);
    setEnterInterest("");
  }

  const handleSaveInterests = () => {
    let newInterests = interests;
    newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
    setKeywords([]);
    setKeywords(newInterests);
    setEnterInterest("");
    handleClose()
  }

  return (
    <>
      <DialogContent>
        {!interests ?
          <>
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item>
                <CircularProgress/>
              </Grid>
              <Grid item>
                <Typography variant="overline"> Loading data </Typography>
              </Grid>
            </Grid>
          </> :
          <>
            {interests.map(interest => {
              return (
                <Box style={{
                  borderRadius: 8,
                  paddingLeft: 16,
                  paddingRight: Boolean(interest.id === editInterest) ? 24 : 16,
                  paddingBottom: Boolean(interest.id === editInterest) ? 16 : "",
                  paddingTop: Boolean(interest.id === editInterest) ? 16 : "",
                  backgroundColor: Boolean(interest.id === editInterest) ? "#E6E6E6" : ""
                }}>
                  <Grid container alignItems="center">
                    <Grid item xs>
                      {editInterest === interest.id ?
                        <>
                          <TextField variant="outlined" defaultValue={interest.text} size="small"
                                     style={{backgroundColor: "#FFF"}} onChange={handleChangeInterest}/>
                        </> :
                        <>
                          <Typography>{interest.text}</Typography>
                        </>}

                    </Grid>
                    <Grid item xs={1}>
                      <Typography style={{fontWeight: editInterest === interest.id ? "bold" : ""}}>
                        {interest.value}
                      </Typography>
                    </Grid>
                    {editInterest === interest.id ? <></> :
                      <>
                        <Grid item xs={1}>
                          <IconButton
                            onClick={() => {
                              setEditInterest(interest.id);
                              setEnterInterest("");
                            }}>
                            <EditIcon/>
                          </IconButton>
                        </Grid>
                      </>}
                  </Grid>
                  <Collapse in={Boolean(interest.id === editInterest)}>
                    <Grid container style={{paddingTop: 8, paddingBottom: 16}}>
                      <Slider onChangeCommitted={(event, value) => handleInterestWeights(event, value, interest)}
                              defaultValue={interest.value} valueLabelDisplay="auto" step={0.1} min={0} max={5}/>
                    </Grid>
                    <Grid container justify="space-between">
                      <IconButton color="secondary">
                        <DeleteIcon/>
                      </IconButton>
                      <Button color="primary" onClick={() => handleUpdateInterest(interest)}>
                        Save
                      </Button>
                    </Grid>
                  </Collapse>
                </Box>
              )
            })}
          </>}


        {/*<Grid item xs={4}>*/}
        {/*  <TextField*/}
        {/*    label="Enter new interest"*/}
        {/*    value={inputNewInterest}*/}
        {/*    onChange={handleNewInterest}*/}
        {/*  ></TextField>*/}
        {/*</Grid>*/}

        {/*<Grid item xs={7}>*/}
        {/*  <Slider*/}
        {/*    defaultValue={defaultNewInterest}*/}
        {/*    value={defaultNewInterest}*/}
        {/*    step={0.1}*/}
        {/*    marks*/}
        {/*    min={0}*/}
        {/*    max={5}*/}
        {/*    valueLabelDisplay="on"*/}
        {/*    sliderId={newInterest}*/}
        {/*    onChange={handleChangeNewInterest}*/}
        {/*  ></Slider>*/}
        {/*</Grid>*/}

        {/*<Grid item xs={1}>*/}
        {/*  <IconButton*/}
        {/*    aria-label="delete"*/}
        {/*    size="small"*/}
        {/*    onClick={saveNewInterest}*/}
        {/*  >*/}
        {/*    <AddIcon />*/}
        {/*  </IconButton>*/}
        {/*</Grid>*/}


        <Dialog open={open}>
          <DialogContent>
            <Typography variant="p">
              Are you sure you want to delete the interest {buttonInterest}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete(buttonInterest)}>Yes</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

      </DialogContent>
      <DialogActions>
        <Grid container justify="space-between" style={{paddingLeft: 16, paddingRight: 16}}>
          <Grid item xs>
            <Button startIcon={<SettingsBackupRestoreIcon/>} color={!reset ? "secondary" : ""} disabled={!reset}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Grid container>
              <Button color="primary" startIcon={<AddIcon/>} style={{paddingRight: 16}}>Add interest</Button>
              <Button color="primary" onClick={handleSaveInterests}>Save</Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};
export default ManageInterests;
