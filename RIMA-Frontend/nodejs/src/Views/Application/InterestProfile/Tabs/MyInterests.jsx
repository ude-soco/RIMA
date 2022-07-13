import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, Dialog, DialogTitle, Grid, Typography,} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ManageInterests from "./ManageInterests";
import RestAPI from "../../../../Services/api";
import WordCloud from "./WordCloud/WordCloud";
import BarChart from "./BarChart/BarChart";
import CirclePacking from "./CiclePacking/CirclePacking";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";


export default function MyInterests() {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState([]);

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  useEffect(() => {
    fetchKeywords().then().catch(err => console.log(err))
  }, []);

  const fetchKeywords = async () => {
    setKeywords([]);
    const response = await RestAPI.longTermInterest(currentUser);
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
        papers: d.papers,
      };
      dataArray.push(newData);
    });
    setKeywords(dataArray);
    return dataArray;
  };

  return (
    <>
      <Grid container justifyContent="flex-end" style={{paddingTop: 32, height: "75vh"}}>
        <Grid item>
          {keywords.length !== 0 ? <>
            <Button color="primary" startIcon={<EditIcon/>} onClick={() => setOpen(!open)}>
              Manage Interests
            </Button>
          </> : <> </>}
        </Grid>
        <Grid item xs={12}>

          <AwesomeSlider style={{height: "60vh"}}>
            <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ? <WordCloud keywords={keywords}/> : <Loading/>}
            </Box>
            <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ? <BarChart keywords={keywords}/> : <Loading/>}
            </Box>
            <Box style={{backgroundColor: "#fff"}}>
              {keywords.length !== 0 ? <CirclePacking keywords={keywords}/> : <Loading/>}
            </Box>
          </AwesomeSlider>
        </Grid>
      </Grid>
      <Dialog open={open} maxWidth="xs" fullWidth style={{zIndex: 11}}>
        <DialogTitle>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              Manage Interests
            </Typography>
          </Grid>
        </DialogTitle>
        <ManageInterests keywords={keywords} setKeywords={setKeywords} open={open} setOpen={setOpen}
                         fetchKeywords={fetchKeywords}/>

      </Dialog>
    </>);
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
          <CircularProgress/>
        </Grid>
        <Grid item>
          <Typography variant="overline"> Loading data </Typography>
        </Grid>
      </Grid>
    </>
  )
}