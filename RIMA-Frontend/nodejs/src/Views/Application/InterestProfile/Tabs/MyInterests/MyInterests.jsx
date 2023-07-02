import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import ManageInterests from "./ManageInterests";
import RestAPI from "../../../../../Services/api";
import WordCloud from "./WordCloud/WordCloud";
import BarChart from "./BarChart/BarChart";
import CirclePacking from "./CiclePacking/CirclePacking";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

export default function MyInterests() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [wordCloudInterest, setWordCloudInterest] = useState({});

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  useEffect(() => {
    fetchKeywords()
      .then()
      .catch((err) => console.log(err));
  }, []);

  const fetchKeywords = async () => {
    setKeywords([]);
    const response = await RestAPI.longTermInterest(currentUser);
    const { data } = response;
    console.log(data);
    let dataArray = [];
    data.forEach((d) => {
      const {
        id,
        categories,
        original_keywords,
        original_keywords_with_weights,
        source,
        keyword,
        weight,
        papers,
      } = d;
      let newData = {
        id: id,
        categories: categories,
        originalKeywords: original_keywords,
        originalKeywordsWithWeights: original_keywords_with_weights,
        source: source,
        text: keyword,
        value: weight,
        papers: papers,
      };
      dataArray.push(newData);
    });
    setKeywords(dataArray);
    return dataArray;
  };
  const handleClose = () => {
    setConfirmCloseDialogOpen(true);
  };

  return (
    <>
      <Grid
        container
        justify="flex-end"
        style={{ paddingTop: 24, height: "75vh" }}
      >
        <Grid item>
          {keywords.length !== 0 ? (
            <>
              <Button
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(!editDialogOpen)}
              >
                Manage Interests
              </Button>
            </>
          ) : (
            <> </>
          )}
        </Grid>
        <Grid item xs={12}>
          <AwesomeSlider style={{ height: "60vh" }}>
            <Box style={{ backgroundColor: "#fff" }}>
              {keywords.length !== 0 ? (
                <WordCloud
                  keywords={keywords}
                  setWordCloudInterest={setWordCloudInterest}
                  setOpen={setEditDialogOpen}
                />
              ) : (
                <Loading />
              )}
            </Box>
            <Grid container style={{ backgroundColor: "#fff" }}>
              <Grid item xs={12}>
                {keywords.length !== 0 ? (
                  <BarChart
                    keywords={keywords}
                    setWordCloudInterest={setWordCloudInterest}
                    setOpen={setEditDialogOpen}
                  />
                ) : (
                  <Loading />
                )}
              </Grid>
            </Grid>
            {/* <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ?
                <CirclePacking keywords={keywords} setWordCloudInterest={setWordCloudInterest} setOpen={setEditDialogOpen}/> :
                <Loading/>}
            </Box> */}
          </AwesomeSlider>
        </Grid>
      </Grid>
      <Dialog
        open={editDialogOpen}
        maxWidth="xs"
        fullWidth
        style={{ zIndex: 11 }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={11}>
              <Typography variant="h5">Manage Interests</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        <ManageInterests
          keywords={keywords}
          setKeywords={setKeywords}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          wordCloudInterest={wordCloudInterest}
          setWordCloudInterest={setWordCloudInterest}
          fetchKeywords={fetchKeywords}
        />
      </Dialog>
      <Dialog
        open={confirmCloseDialogOpen}
        maxWidth="xs"
        fullWidth
        style={{ zIndex: 11 }}
      >
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              Are you sure you want to close?
            </Typography>
          </Grid>
        </DialogTitle>
        <DialogContent style={{ padding: "16px" }}>
          <Typography>
            If you close without saving, you will lose your changes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmCloseDialogOpen(false);
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              setConfirmCloseDialogOpen(false);
              setEditDialogOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const Loading = () => {
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <CircularProgress />
        </Grid>
        <Grid item>
          <Typography variant="overline"> Loading data </Typography>
        </Grid>
      </Grid>
    </>
  );
};
