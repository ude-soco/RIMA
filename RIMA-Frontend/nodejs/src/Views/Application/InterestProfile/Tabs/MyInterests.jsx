import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from '@material-ui/icons/Close';
import ManageInterests from "./ManageInterests";
import RestAPI from "../../../../Services/api";
import WordCloud from "./WordCloud/WordCloud";
import BarChart from "./BarChart/BarChart";
import CirclePacking from "./CiclePacking/CirclePacking";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";


export default function MyInterests() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Start Clara
  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  const [keywords, setKeywords] = useState([]);
  const [interestsWeight, setInterestsWeight] = useState();

  const loading = <>
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <CircularProgress/>
      </Grid>
      <Grid item>
        <Typography variant="overline"> Loading data </Typography>
      </Grid>
    </Grid>
  </>

  const [allNewInterests, setAllNewInterests] = useState({});
  const [changeInterests, setChangeInterests] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [idsDelete, setIdsDelete] = useState([]);
  const [saveOpen, setSaveOpen] = useState(false);
  const [idArray, setIdArray] = useState([]);
  const [rememberDelete, setRememberDelete] = useState();
  const [reset, setReset] = useState(true);

  // get user data
  useEffect(() => {
    RestAPI.longTermInterest(currentUser).then((response) => {
      const {data} = response;
      let dataArray = [];
      data.forEach((d) => {
        let newData = {
          id: d.id,
          categories: d.categories,
          originalKeywords: d.original_keywords,
          source: d.source,
          text: d.keyword,
          value: d.weight,
        };
        dataArray.push(newData);
      });
      setKeywords(dataArray);

      let interestsWeightArray = {};
      let allNewKeywordsArray = {};
      for (let i = 0; i < response.data.length; i++) {
        interestsWeightArray[response.data[i].keyword] = {
          weight: response.data[i].weight, id: response.data[i].id,
        };
        allNewKeywordsArray[response.data[i].keyword] = {
          weight: response.data[i].weight, id: response.data[i].id,
        };
        idArray.push(response.data[i].id);
      }

      setInterestsWeight(interestsWeightArray);
      setAllNewInterests(allNewKeywordsArray);
      setIdArray(idArray);
    });
  }, []);

  //change Object to be saveable
  const prepareForSave = (saveObject) => {
    let newArray = [];
    Object.keys(saveObject).map((interest) => {
      newArray.push({
        name: interest, weight: saveObject[interest]["weight"], id: saveObject[interest]["id"],
      });
    });

    return newArray;
  };

  //handles delete
  const deleteInterest = () => {
    idsDelete.map((id) => {
      RestAPI.deletekeyword(id);
    });
  };

  //handles save
  const saveInterests = (saveable) => {
    RestAPI.addKeyword(saveable);
  };

  //only if saved, the changes will be applied to the interestsWeights one
  const handleSave = () => {
    setInterestsWeight(allNewInterests);
    const saveable = prepareForSave(allNewInterests);
    saveInterests(saveable);
    setSaveOpen(true);
  };

  //resets deleted interest
  const resetInterest = (interest) => {
    const name = interest[0];
    const weight = interest[1];
    const id = interest[2];
    allNewInterests[name] = {weight: weight, id: id};
    setAllNewInterests(allNewInterests);
  };

  // reactivates deleted interest, only the last deleted one
  const handleReset = () => {
    setReset(true);
    resetInterest(rememberDelete);
  };

  //handles cancel, two possible ways: no changes it simply closes, if changes have been applied, ask user
  const handleCancel = () => {
    console.log(reset, "test handle cancel");
    if (!reset || changeInterests) {
      setCancel(true);
    } else handleClose();
  };

  //Close for cancel after confirmation dialogue
  const handleCloseCancel = () => {
    handleClose();
    setCancel(false);
  };

  //save for confirmation dialogue after cancel
  const handleSaveCancel = () => {
    handleSave();
    setCancel(false);
  };

  //ids of deleted interests
  const handleIdsDelete = (ids) => {
    idsDelete.push(ids);
    setIdsDelete(idsDelete);
    console.log(idsDelete, "test IDs Delete");
  };

  //opens dialogue after saving
  const handleSaveOpen = () => {
    deleteInterest();
    setSaveOpen(false);
    handleClose();
  };

  //End Clara
  return (<>
    <Grid container justify="flex-end" style={{paddingTop: 32, height: "75vh"}}>
      <Grid item>
        <Button color="primary" startIcon={<EditIcon/>} onClick={handleOpen}>
          Manage Interests
        </Button>
      </Grid>
      <Grid item xs={12}>

        <AwesomeSlider style={{height: "60vh"}}>
          <Box style={{backgroundColor: "#fff"}}>
            {keywords.length !== 0 ? <WordCloud keywords={keywords}/> : <> {loading} </>}
          </Box>
          <Box style={{backgroundColor: "#fff"}}>
            {keywords.length !== 0 ? <BarChart keywords={keywords}/> : <> {loading} </>}
          </Box>
          <Box style={{backgroundColor: "#fff"}}>
            {keywords.length !== 0 ? <CirclePacking keywords={keywords}/> : <> {loading} </>}
          </Box>
        </AwesomeSlider>
      </Grid>
    </Grid>
    {/* The dialog that is not really finished/showing begins here */
      //start Clara
    }

    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Typography variant="h5">Manage Interests</Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon/>
          </IconButton>

        </Grid>
      </DialogTitle>

      <ManageInterests
        keywords={keywords}
        setKeywords={setKeywords}
        handleClose={handleCancel}
        interestsWeights={interestsWeight}
        allNewInterests={allNewInterests}
        setAllNewInterests={setAllNewInterests}
        setWeightsInterests={setInterestsWeight}
        setRememberDelete={setRememberDelete}
        setChangeInterests={setChangeInterests}
        handleIdsDelete={handleIdsDelete}
        ids={idArray}
        setReset={setReset}
      />

      {/*<DialogActions>*/}
      {/*  <Grid container justify="space-between" style={{paddingLeft: 16, paddingRight: 16}}>*/}
      {/*    <Grid item xs>*/}
      {/*      <Button onClick={handleReset} disabled={reset}*/}
      {/*              startIcon={<SettingsBackupRestoreIcon color={!reset ? "secondary" : ""}/>}>*/}
      {/*        Reset*/}
      {/*      </Button>*/}
      {/*    </Grid>*/}
      {/*    <Grid item>*/}
      {/*      <Grid container>*/}
      {/*        <Button color="primary" startIcon={<AddIcon/>} style={{paddingRight: 16}}>Add interest</Button>*/}
      {/*        <Button onClick={handleSave} color="primary">Save</Button>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*</DialogActions>*/}
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
        <Typography variant="h6">Your changes are saved!</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveOpen}> OK</Button>
      </DialogActions>
    </Dialog>
  </>);
}
