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
import * as React from "react";
import {useState} from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
import Slider from "@material-ui/core/Slider";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import AddIcon from "@material-ui/icons/Add";
import Fade from '@material-ui/core/Fade';


const ManageInterests = (props) => {
  const {keywords, setKeywords, handleClose} = props;

  const [interests, setInterests] = useState(keywords)
  const [editInterest, setEditInterest] = useState(false);
  const [enterInterest, setEnterInterest] = useState("");
  const [enterInterestWeight, setEnterInterestWeight] = useState(1);
  const [reset, setReset] = useState(false);
  const [enterNewInterest, setEnterNewInterest] = useState(false)
  const [exist, setExist] = useState(false);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [interestToDelete, setInterestToDelete] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleInterestWeights = (event, value, interest) => {
    setInterests([]);
    let newInterests = interests;
    const index = newInterests.findIndex(i => i.id === interest.id);
    if (index !== -1) {
      newInterests[index].value = value
      if (enterInterest !== "") {
        newInterests[index].text = enterInterest;
        setEnterInterest("");
      }
    }
    setInterests(newInterests);
  }

  const handleChangeInterest = (event) => {
    if (exist) {
      setExist(false);
    }
    const {target: {value}} = event;
    setEnterInterest(value)
  }

  const handleUpdateInterest = (interest) => {
    let alreadyExist = validateInterest(enterInterest);
    if (!alreadyExist) {
      setInterests([]);
      let newInterests = interests;
      const index = newInterests.findIndex(i => i.id === interest.id);
      if (index !== -1 && enterInterest !== "") {
        newInterests[index].text = enterInterest;
        setEnterInterest("");
      }
      setInterests(newInterests);
      setEditInterest(false);
    } else {
      setExist(true);
    }
  }

  const handleSaveInterests = () => {
    let newInterests = interests;
    newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
    setKeywords([]);
    setTimeout(() => {
      setKeywords(newInterests);
    }, 500)
    handleClose()
  }

  const handleAddNewInterest = () => {
    let alreadyExist = validateInterest(enterInterest);
    if (!alreadyExist) {
      setExist(false);
      let newInterests = interests;
      let newInterest = {
        id: Date.now(),
        categories: [],
        originalKeywords: [],
        source: "Manual",
        text: enterInterest,
        value: enterInterestWeight,
      }
      newInterests.push(newInterest);
      setInterests(newInterests);
      setEnterNewInterest(false);
    } else {
      setExist(true);
    }
  }

  const handleCancelNewInterest = () => {
    setEnterNewInterest(false);
    setEnterInterest("");
    setEnterInterestWeight(1);
  }

  const validateInterest = (interest) => {
    return interests.some((i) => i.text === interest);
  };

  const handleDeleteClick = (event, interest) => {
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
                                     style={{backgroundColor: "#FFF"}} onChange={handleChangeInterest} error={exist}/>
                          {exist ?
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
                            onClick={() => {
                              setEditInterest(interest.id);
                              setEnterInterest(interest.text);
                            }
                            }>
                            <EditIcon/>
                          </IconButton>
                        </Grid>
                      </>
                    }
                  </Grid>
                  <Collapse in={Boolean(interest.id === editInterest)}>
                    <Grid container alignItems="center" style={{paddingTop: 24, paddingBottom: 16}}>
                      <Grid item xs>
                        <Slider onChangeCommitted={(event, value) => handleInterestWeights(event, value, interest)}
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
                        <IconButton color="secondary" onClick={(event) => handleDeleteClick(event, interest)}>
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
                                    <Button style={{marginRight: 16}} onClick={(event) => handleDeleteClick(event, {})}>
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
                      <Button color="primary" variant="contained" size="small" disabled={!Boolean(enterInterest)}
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
                  <TextField variant="outlined" defaultValue={enterInterest} fullWidth
                             style={{backgroundColor: "#FFF"}} error={exist} label="New interest"
                             onChange={(event) => setEnterInterest(event.target.value)}/>
                  {exist ? <Typography variant="caption" color="error">Interest already exists!</Typography> : <></>}
                </Grid>
              </Grid>
              <Grid container alignItems="center" style={{paddingTop: 24, paddingBottom: 16}}>
                <Grid item xs>
                  <Slider onChangeCommitted={(event, value) => setEnterInterestWeight(value)}
                          defaultValue={enterInterestWeight} valueLabelDisplay="auto" step={0.1} min={1} max={5}/>
                </Grid>
                <Grid item style={{marginLeft: 32}}>
                  <Typography variant="h4" style={{fontWeight: "bold"}}>
                    {enterInterestWeight}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justify="space-between">
                <Button onClick={handleCancelNewInterest}>
                  Cancel
                </Button>
                <Button color="primary" variant="contained" onClick={handleAddNewInterest}>
                  Save
                </Button>
              </Grid>
            </Box>
          </> : <></>}
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
              <Button color="primary" startIcon={<AddIcon/>} style={{paddingRight: 16}}
                      disabled={enterNewInterest || Boolean(editInterest)}
                      onClick={() => setEnterNewInterest(true)}>
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
