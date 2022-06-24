import {
  Button,
  Grid,
  makeStyles,
  Box,
  Modal,
  Typography,
  Slider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper, TextField,
}
  from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from '@material-ui/icons/Add';
import * as React from "react";
import RestAPI from "../Services/api";

const ManageInterests = (props) => {
  const interestsWeights = props.interestsWeights;
  const setRememberDelete = props.setRememberDelete;
  const setReset = props.setReset;
  const allNewInterests = props.allNewInterests;
  const setAllNewInterests = props.setAllNewInterests;
  const setChangeInterests=props.setChangeInterests;
  const handleIdsDelete = props.handleIdsDelete;
  const ids = props.ids;

  //handle PopUp
  const [open, setOpen] = React.useState(false);
  //see what button is clicked for what interest
  const [buttonInterest, setButtonInterest] = React.useState(false);
  //name of new interest
  const [newInterest, setNewInterest] = React.useState("");
  //weight of new interest, start = 2.5
  const [newInterestWeight, setNewInterestWeight] = React.useState(2.5);
  //for reseting the interest after saving it
  const [inputNewInterest, setInputNewInterest] = React.useState("")
  // for reseting
  const [defaultNewInterest, setDefaultNewInterest] = React.useState(2.5)


  const handleClose = () => setOpen(false);

  const handleChange = (sliderId)=>(e, value) => {
    //track changing slider values & apply as new value
    allNewInterests[sliderId]["weight"]=value
    setAllNewInterests(allNewInterests)
    setChangeInterests(true)
    console.log(sliderId, "test handleChange", interestsWeights[sliderId]["weight"], allNewInterests[sliderId]["weight"])
  }

  //delete interest
  const handleDelete = (name) => (e, value)=>{
    const id = allNewInterests[name]["id"]
    const weight = allNewInterests[name]["weight"]
    delete allNewInterests[name]
    //remeber deleted interest
    setRememberDelete([name, weight, id])
    setReset(false)
    setAllNewInterests(allNewInterests)
    handleIdsDelete(id)
    handleClose()
  }

  //changes value new interest
  const handleNewInterest = (e) =>{
    setNewInterest(e.target.value)
    setInputNewInterest(e.target.value)
  }

  //changes new interest
  const handleChangeNewInterest = (e, value) => {
    setNewInterestWeight(value);
    setDefaultNewInterest(value)
  }


  const saveNewInterest = () =>{
    //find not used ID
    const id = Math.max(...ids) +1;
    //add new interest
    allNewInterests[newInterest] = {"weight":newInterestWeight,"id":id }
    setAllNewInterests(allNewInterests)
    setChangeInterests(true)
    //reset values
    setInputNewInterest("")
    setDefaultNewInterest(2.5)
  }

  //want to delete interest?
  const handleOpenConfirmation = (name) =>() => {
    setOpen(true)
    setButtonInterest(name)
    handleDelete(name)
  };

  return<>
  <Grid container direction="row" spacing={2} style={{paddingTop:32}}>

    {Object.keys(allNewInterests).map((interest) =>{
      return <>
            <Grid item xs={4}>
            <Typography variant="h6">
              {interest}
            </Typography>
            </Grid>

            <Grid item xs={7}>
              <Slider
                  key={interest}
                  sliderId={interest}
                  defaultValue={allNewInterests[interest]["weight"]}
                  valueLabelDisplay="auto"
                  step={0.1}
                  marks
                  min={0}
                  max={5}
                  valueLabelDisplay="on"
                  onChange={handleChange(interest)}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton aria-label="delete" size="small" onClick={handleOpenConfirmation(interest)} >
                <DeleteIcon />
              </IconButton>
            </Grid>

          </>
    } )}

    <Grid item xs = {4}>
      <TextField label="Enter new interest" value={inputNewInterest} onChange={handleNewInterest} ></TextField>
    </Grid>

    <Grid item xs={7}>
      <Slider defaultValue={defaultNewInterest}
              value = {defaultNewInterest}
              step={0.1}
              marks
              min={0}
              max={5}
              valueLabelDisplay="on"
              sliderId={newInterest}
              onChange = {handleChangeNewInterest}></Slider>
    </Grid>

    <Grid item xs = {1}>
      <IconButton aria-label="delete" size="small" onClick={saveNewInterest} >
        <AddIcon/>
      </IconButton>
    </Grid>

  </Grid>

    <Dialog open={open}>
      <DialogContent>
        <Typography variant="p">
          Are you sure you want to delete the interest {buttonInterest}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
            onClick={handleDelete(buttonInterest)}
        >
          Yes
        </Button>
        <Button
            onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
</>
}
export default ManageInterests