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
  
  const [selectedNames, setSelectedNames] = useState(data.selectedNames);
  

  const nameId = data.filter//citations.reduce((obj, item) => {obj[item.name] = item.id; return obj}, {})
  const namesList = Object.values(nameId).map((value) => value[0])
  
  console.log(namesList)
  console.log(nameId, "TEST")

  console.log(data, "DATAAAAAAAAAAAAAAA")
  console.log(data.citations.map(item => item.name))
  /*const names = data.citations.map(item => item.name).concat(data.references.map(item => item.name))
  const uniqNames = [...new Set(names)]
  console.log(names, uniqNames)*/

  
  


  const handleCheckboxChange = (event) => {
    const{value} = event.target
    const id = (Object.entries(nameId).find(([key, value2]) => value2[0] === value))[0] //[0] cause its an array
    console.log(id, "VALUE")
    if(!(selectedNames.includes(id)))
    {
    setSelectedNames([...selectedNames, id])
    }
    else {
      setSelectedNames(prevArray => prevArray.filter(obj => obj !== id))
    }
  }
  
  console.log(selectedNames, "selectedNames")

  const classes = useStyles();

  const handleApply = () => {
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
              {namesList.map(name =>(<FormControlLabel key = {name} control={<Checkbox onChange={handleCheckboxChange} 
              value={name} checked={selectedNames.includes((Object.entries(nameId).find(([key, value2]) => value2[0] === name))[0])}/>} label={name} />))} 
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