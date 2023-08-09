import React, {useState} from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "16px",
        textTransform: "uppercase",
      },
    divider:{
        marginBottom: "30px",
        height: "2px",
        backgroundColor: "black",
    },
    checkBox:{
       marginLeft:"30px"
    }
  }));

export default function MoreFilters(props) {
 
  const {data} = props
  
  const [selectedNames, setSelectedNames] = useState(data.selectedNames); //Filter list (consistet)
  

  const nameId = data.filter //AUthors id list
  const namesList = Object.values(nameId).map((value) => value[0]) //map author id to names
  /*
  console.log(namesList)
  console.log(nameId, "TEST")
  console.log(data, "DATAAAAAAAAAAAAAAA")
  console.log(data.citations.map(item => item.name))
  console.log(namesList.map(name => name))*/
  

  
  

  //add names to list internal list
  const handleCheckboxChange = (event) => {
    const{value} = event.target
    const id = (Object.entries(nameId).find(([key, value2]) => value2[0] === value))[0] //[0] cause its an array, get id
    //console.log(id, "VALUE")
    if(!(selectedNames.includes(id))) //prevent duplicates and deltete unselected names which got selected before
    {
    setSelectedNames([...selectedNames, id])
    }
    else {
      setSelectedNames(prevArray => prevArray.filter(obj => obj !== id))
    }
  }
  
  //console.log(selectedNames, "selectedNames")

  const classes = useStyles();

  const handleApply = () => { //add names to global list 
    props.onSelectedNamesChange(selectedNames)
    //props.onClose(selectedNames);
  };

 const handleClose = () => {
    props.onClose(selectedNames);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md"  >
      <DialogTitle className={classes.title}>Hide Authors you already know </DialogTitle>
      <DialogContent dividers>

      <Typography variant="h6"  className={classes.title}>Select</Typography>
            <FormGroup className={classes.checkBox}>
            <Divider className={classes.divider}/>
              {namesList.map(name =>(<FormControlLabel key = {name} control={<Checkbox onChange={handleCheckboxChange}  //map names to checkbox list and handle checking, find id in list
              value={name} checked={!selectedNames.includes((Object.entries(nameId).find(([key, value2]) => value2[0] === name))[0])}/>} label={name} />))} 
            </FormGroup>
                  
          <Divider className={classes.divider}/>
                  
          <Box
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleApply}
              style={{
                backgroundColor: "blue",
                color: "white",
                marginRight: "2px"
              }}
            >
              Apply
            </Button>
            <Button
              onClick={handleClose}
              style={{ backgroundColor: "grey", color: "white" }}
            >
              Close
            </Button>
          </Box>
      </DialogContent>
    </Dialog>
  );
}