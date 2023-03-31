import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Popper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
import Slider from "@material-ui/core/Slider";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import AddIcon from "@material-ui/icons/Add";
import Fade from '@material-ui/core/Fade';
import RestAPI from "../../../../../Services/api";


const ManageInterests = (props) => {

  const {keywords, setKeywords, open, setOpen, wordCloudInterest, setWordCloudInterest, fetchKeywords} = props;
  console.log("data keywords", keywords)
  const [interests, setInterests] = useState([])
  const [editInterest, setEditInterest] = useState(false);
  const [updateInterestText, setUpdateInterestText] = useState("");
  const [updateInterestWeight, setUpdateInterestWeight] = useState(1);
  const [enterNewInterest, setEnterNewInterest] = useState(false)
  const [existInterest, setExistInterest] = useState(false);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [interestToDelete, setInterestToDelete] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (wordCloudInterest) {
      handleEditInterest(wordCloudInterest);
    }
    setInterests(keywords)
  }, [keywords]);

  const handleUpdateInterestWeights = (event, value, interest) => {
    setInterests([]);
    let newInterests = interests;
    const index = newInterests.findIndex(i => i.id === interest.id);
    if (index !== -1) {
      newInterests[index].value = value
      newInterests[index].text = updateInterestText;
    }
    setInterests(newInterests);
    if (deleteAnchorEl) {
      setDeleteAnchorEl(null);
    }
  }

  const handleEditInterest = (interest) => {
    setUpdateInterestText(interest.text);
    setEditInterest(interest.id);
  }

  const handleUpdateInterestText = (event) => {
    if (existInterest) {
      setExistInterest(false);
    }
    const {target: {value}} = event;
    setUpdateInterestText(value)
  }

  const handleUpdateInterest = (interest) => {
    if (deleteAnchorEl) {
      setDeleteAnchorEl(null);
    }
    let filteredInterest = interests.filter(i => i.id !== interest.id);
    let alreadyExist = validateInterest(filteredInterest, updateInterestText);
    if (!alreadyExist) {
      setInterests([]);
      let newInterests = interests;
      const index = newInterests.findIndex(i => i.id === interest.id);
      if (index !== -1 && updateInterestText !== "") {
        newInterests[index].text = updateInterestText;
        // TODO: When the interest is updated, should it replace the existing data?
        setUpdateInterestText("");
      }
      setInterests(newInterests);
      setEditInterest(false);
    } else {
      setExistInterest(true);
    }
  }

  const handleSaveInterests = async () => {
    setKeywords([]);
    let newInterests = interests;
    newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
    setTimeout(() => {
      setKeywords(newInterests);
    }, 500)
    let listOfInterests = [];
    newInterests.forEach(interest => {
      let item = {
        name: interest.text,
        weight: interest.value,
        id: interest.id
      }
      listOfInterests.push(item);
    });
    try {
      console.log(listOfInterests, "data list of interests")
      await RestAPI.addKeyword(listOfInterests);
    } catch (err) {
      console.log(err);
    }
    setOpen(!open);
    setWordCloudInterest({})
  }

  const handleAddNewInterest = () => {
    let alreadyExist = validateInterest(interests, updateInterestText);
    if (!alreadyExist) {
      setExistInterest(false);
      let newInterests = interests;
      let newInterest = {
        id: Date.now(),
        categories: [],
        originalKeywords: [],
        source: "Manual",
        text: updateInterestText,
        value: updateInterestWeight,
      }
      newInterests.push(newInterest);
      setInterests(newInterests);
      setEnterNewInterest(false);
    } else {
      setExistInterest(true);
    }
  }

  const handleCancelNewInterest = () => {
    setEnterNewInterest(false);
    setUpdateInterestText("");
    setUpdateInterestWeight(1);
  }

  const validateInterest = (interests, interest) => {
    return interests.some((i) => i.text === interest);
  };

  const handleOpenDeleteModal = (event, interest) => {
    setInterestToDelete(interest);
    setDeleteAnchorEl(deleteAnchorEl ? null : event.currentTarget);
  };

  const handleDeleteInterest = () => {
    let newInterests = interests.filter(i => i.id !== interestToDelete.id)
    setInterests([]);
    setInterests(newInterests);
    setConfirmDelete(true);
    setEditInterest(false);
    setDeleteAnchorEl(null);
  }

  const resetInterest = async () => {
    const data = await fetchKeywords();
    setInterests(data)
  }
  return (
    <>
      <DialogContent>
        {interests.length === 0 ?
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
                <Box
                  key={interest.id}
                  style={{
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
                          <TextField variant="outlined" defaultValue={interest.text} fullWidth label="Interest"
                                     style={{backgroundColor: "#FFF"}} onChange={handleUpdateInterestText}
                                     error={existInterest}/>
                          {existInterest ?
                            <Typography variant="caption" color="error">Interest already exists!</Typography> : <></>}
                        </> :
                        <>
                          <Typography>{interest.text}</Typography>
                        </>}

                    </Grid>
                    {editInterest === interest.id ? <></> :
                      <>
                        <Grid item xs={1}>
                          <Typography> {interest.value} </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            disabled={editInterest === interest.id || editInterest}
                            onClick={() => handleEditInterest(interest)}>
                            <EditIcon/>
                          </IconButton>
                        </Grid>
                      </>
                    }
                  </Grid>
                  <Collapse in={Boolean(interest.id === editInterest)}>
                    <Grid container alignItems="center" style={{paddingTop: 24, paddingBottom: 16}}>
                      <Grid item xs>
                        <Slider
                          onChangeCommitted={(event, value) => handleUpdateInterestWeights(event, value, interest)}
                          defaultValue={interest.value} valueLabelDisplay="auto" step={0.1} min={1} max={5}/>
                      </Grid>
                      <Grid item style={{marginLeft: 32}}>
                        <Typography variant="h4" style={{fontWeight: "bold"}}>
                          {interest.value}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container justify="space-between">
                      <Tooltip title="Delete interest" arrow>
                        <IconButton color="secondary" onClick={(event) => handleOpenDeleteModal(event, interest)}>
                          <DeleteIcon/>
                        </IconButton>
                      </Tooltip>
                      <Popper open={Boolean(deleteAnchorEl)} anchorEl={deleteAnchorEl}
                              style={{zIndex: 11}}
                              transition placement="bottom">
                        {({TransitionProps}) => (
                          <Fade {...TransitionProps} timeout={0}>
                            <Paper style={{padding: 16, width: 280}}>
                              <Grid container>
                                <Typography gutterBottom>Are you sure you want to delete?</Typography>
                                <Grid container>
                                  <Grid item xs/>
                                  <Grid item>
                                    <Button style={{marginRight: 16}}
                                            onClick={(event) => handleOpenDeleteModal(event, {})}>
                                      No
                                    </Button>
                                    <Button color="secondary" variant="contained" onClick={handleDeleteInterest}>
                                      Yes
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                      <Button color="primary" variant="contained" size="small"
                              disabled={!Boolean(updateInterestText)}
                              onClick={() => handleUpdateInterest(interest)}>
                        Update
                      </Button>
                    </Grid>
                  </Collapse>

                  <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    open={confirmDelete}
                    autoHideDuration={6000}
                    onClose={() => setConfirmDelete(false)}
                    message="Interest deleted!"
                  />
                </Box>
              )
            })}
          </>}

        {enterNewInterest ?
          <>
            <Box
              style={{
                borderRadius: 8,
                paddingLeft: 16,
                paddingRight: 24,
                paddingBottom: 16,
                paddingTop: 16,
                backgroundColor: "#E6E6E6"
              }}>
              <Grid container alignItems="center">
                <Grid item xs>
                  <TextField variant="outlined" defaultValue={updateInterestText} fullWidth
                             style={{backgroundColor: "#FFF"}} error={existInterest} label="New interest"
                             onChange={(event) => setUpdateInterestText(event.target.value)}/>
                  {existInterest ?
                    <Typography variant="caption" color="error">Interest already exists!</Typography> : <></>}
                </Grid>
              </Grid>
              <Grid container alignItems="center" style={{paddingTop: 24, paddingBottom: 16}}>
                <Grid item xs>
                  <Slider onChangeCommitted={(event, value) => setUpdateInterestWeight(value)}
                          defaultValue={updateInterestWeight} valueLabelDisplay="auto" step={0.1} min={1} max={5}/>
                </Grid>
                <Grid item style={{marginLeft: 32}}>
                  <Typography variant="h4" style={{fontWeight: "bold"}}>
                    {updateInterestWeight}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justify="space-between">
                <Button onClick={handleCancelNewInterest}
                        variant={Boolean(updateInterestText) ? "" : "contained"}
                        color={Boolean(updateInterestText) ? "" : "primary"}>
                  Cancel
                </Button>
                <Button color="primary" variant="contained"
                        disabled={!Boolean(updateInterestText)}
                        onClick={handleAddNewInterest}>
                  Save
                </Button>
              </Grid>
            </Box>
          </> : <></>}
      </DialogContent>

      <DialogActions style={{padding: 24}}>
        <Grid container justify="space-between">
          <Grid item xs>
            <Button startIcon={<SettingsBackupRestoreIcon/>} color="secondary"
                    onClick={resetInterest}>
              Reset
            </Button>
          </Grid>
          <Grid item>
            <Grid container>
              <Button color="primary" startIcon={<AddIcon/>} style={{paddingRight: 16}}
                      disabled={enterNewInterest || Boolean(editInterest)}
                      onClick={() => {
                        setUpdateInterestText("");
                        setEnterNewInterest(true);
                      }}>
                Add interest
              </Button>
              <Button color="primary" variant="contained" onClick={handleSaveInterests}
                      disabled={enterNewInterest || Boolean(editInterest)}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogActions>

    </>
  );
};
export default ManageInterests;
