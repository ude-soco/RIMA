import * as React from "react";
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
    DialogActions
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import InterestOverviewNew from "./InterestOverviewNew";
import ManageInterests from "../../../KeywordNew";
import RestAPI from "../../../../Services/api";


const useStyles = makeStyles((theme) => ({
  spacing: {
    padding: theme.spacing(2),
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  padding: {
    margin: theme.spacing(15, 0, 15, 0),
  },
}));

const style = {
  height: 300,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MyInterests() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);





  //Start Clara
    let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
    // the values for the interestsWeight
    const [interestsWeight, setInterestsWeight]= React.useState();
    // other version of the values, so that the changes are only applied if we click save
    const [allNewInterests, setAllNewInterests] = React.useState({})
    //detects if we hava any changes, so that we user gets asked if he wants to leave after clicking cancel
    const [changeInterests, setChangeInterests] = React.useState(false)
    //triggers cancel dialog
    const [cancel, setCancel] = React.useState(false)
    //remeber which interests should be deleted
    const [idsDelete, setIdsDelete] = React.useState([])
    //triggers save dialog
    const [saveOpen, setSaveOpen] = React.useState(false)
    // the ids of all interests, so that a new one can be constructed, which is not already used
    const [idArray, setIdArray] = React.useState([]);
    //remembers the deleted interest
    const [rememberDelete, setRememberDelete]= React.useState();
    // activates reset button if one of the interests are deleted
    const [reset, setReset] = React.useState(true);

    // get user data
    React.useEffect(() => {
        RestAPI.longTermInterest(currentUser)
            .then((response) => {
                console.log(response.data, "data")
                //let interestsArray=[];

                let interestsWeightArray={};
                let allNewKeywordsArray = {};
                for (let i = 0; i < response.data.length; i++){

                    interestsWeightArray[response.data[i].keyword]={"weight":response.data[i].weight,
                                                                    "id":response.data[i].id}
                    allNewKeywordsArray[response.data[i].keyword]={"weight":response.data[i].weight,
                                                                    "id":response.data[i].id}
                    idArray.push(response.data[i].id)



                };

                setInterestsWeight(interestsWeightArray);
                setAllNewInterests(allNewKeywordsArray)
                setIdArray(idArray)
            });
    }, []);

    //change Object to be saveable
    const prepareForSave = (saveObject) => {
        let newArray=[]
        Object.keys(saveObject).map((interest) =>{
            newArray.push({name:interest, weight:saveObject[interest]["weight"], id:saveObject[interest]["id"]})
    })

    return newArray}

    //handles delete
    const deleteInterest = () => {
        idsDelete.map((id)=>{
            RestAPI.deletekeyword(id)
        })
    }

    //handles save
    const saveInterests = (saveable) => {
        RestAPI.addKeyword(saveable)
    }

    //only if saved, the changes will be applied to the interestsWeights one
    const handleSave = () =>{
        setInterestsWeight(allNewInterests)
        const saveable= prepareForSave(allNewInterests)
        saveInterests(saveable)
        setSaveOpen(true)
    }

    //resets deleted interest
    const resetInterest = (interest) => {
        const name=interest[0]
        const weight = interest[1]
        const id = interest[2]
        allNewInterests[name]={"weight":weight,"id":id}
        setAllNewInterests(allNewInterests)
    }

    // reactivates deleted interest, only the last deleted one
    const handleReset = () => {
        setReset(true)
        resetInterest(rememberDelete)
    }

    //handles cancel, two possible ways: no changes it simply closes, if changes have been applied, ask user
    const handleCancel = () => {
        console.log(reset, "test handle cancel")
        if (!reset || changeInterests){
            setCancel(true)
        }
        else(handleClose())
    }

    //Close for cancel after confirmation dialogue
    const handleCloseCancel = () =>{
        handleClose()
        setCancel(false)
    }

    //save for confirmation dialogue after cancel
    const handleSaveCancel = () => {
        handleSave()
        setCancel(false)
    }

    //ids of deleted interests
    const handleIdsDelete = (ids) => {
        idsDelete.push(ids)
        setIdsDelete(idsDelete)
        console.log(idsDelete, "test IDs Delete")
    }

    //opens dialogue after saving
    const handleSaveOpen = () =>{
        deleteInterest()
        setSaveOpen(false)
        handleClose()

    }

    //End Clara

  return (
  <>
    <Grid container justify="flex-end" style={{paddingTop:32}} >
      <Grid item>
        <Button 
        variant="outlined" 
        startIcon={<EditIcon />}
        onClick={handleOpen}
        >
          Manage Interests
        </Button>
      </Grid>
      <Grid item xs={12}>
        <InterestOverviewNew classes={classes} interestsWeights={interestsWeight}/>
      </Grid>
    </Grid>
    {/* The dialog that is not really finished/showing begins here */
    //start Clara
        }

    <Dialog
          open={open}
          onClose={handleClose}
          size="lg"
          id="modal"
          maxWidth="lg"
        >
         <DialogTitle id="alert-dialog-title">{"Manage Interests"}</DialogTitle>
         <DialogContent>
             <ManageInterests interestsWeights={interestsWeight}
                              allNewInterests = {allNewInterests}
                              setAllNewInterests = {setAllNewInterests}
                              setWeightsInterests={setInterestsWeight}
                              setRememberDelete={setRememberDelete}
                              setChangeInterests ={setChangeInterests}
                              handleIdsDelete={handleIdsDelete}
                              ids={idArray}
                              setReset ={setReset}/>

         </DialogContent>

         <DialogActions>
             <Button
                 onClick={handleSave}
             >
                 Save
             </Button>
         <Button
              onClick={handleCancel}
              >
              Cancel
          </Button>
            <Button
                onClick={handleReset} disabled={reset}
                > Reset
            </Button>

         </DialogActions>
        </Dialog>

      <Dialog open={cancel}>
          <DialogContent>
              <Typography variant="h6">
                  Are you sure you want to leave without saving? All your changes will be lost.
              </Typography>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleSaveCancel}> Save</Button>
              <Button onClick={handleCloseCancel}>Close</Button>
          </DialogActions>
      </Dialog>

      <Dialog open={saveOpen}>
          <DialogContent>
              <Typography variant="h6">
                  Your changes are saved!
              </Typography>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleSaveOpen}> OK</Button>
          </DialogActions>
      </Dialog>


        </>
  );
}
