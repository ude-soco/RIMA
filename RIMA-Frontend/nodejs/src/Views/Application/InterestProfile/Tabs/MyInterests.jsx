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
  const [currInterest, setCurrInterest] = useState("")


  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openPopOver = Boolean(anchorEl);
  const id = openPopOver ? 'simple-popover' : undefined;

  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));
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

  // get user data
  useEffect(() => {
    RestAPI.longTermInterest(currentUser).then((response) => {
      const {data} = response;
      console.log(data)
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
        //console.log("test original keywords",newData)

      });
      setKeywords(dataArray);
      //console.log("test original keywords",dataArray)

    });
  }, []);

  return (<>
    <Grid container justify="flex-end" style={{paddingTop: 32, height: "75vh"}}>
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
            {keywords.length !== 0 ? <WordCloud keywords={keywords}
                                                handleClickPopOver={handleClickPopOver}
                                                id={id}
                                                setCurrInterest={setCurrInterest}/> : <> {loading} </>}
          </Box>
          <Box style={{backgroundColor: "#fff"}}>
            {keywords.length !== 0 ? <BarChart keywords={keywords}
                                               handleClickPopOver={handleClickPopOver}
                                               id={id}
                                               setCurrInterest={setCurrInterest}
              />
              : <> {loading} </>}
          </Box>
          <Box style={{backgroundColor: "#fff"}}>
            {keywords.length !== 0 ? <CirclePacking keywords={keywords}/> : <> {loading} </>}
          </Box>
        </AwesomeSlider>
      </Grid>
    </Grid>
    <Dialog open={open} maxWidth="xs" fullWidth style={{zIndex: 11}}>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Typography variant="h5">
            Manage Interests
          </Typography>
        </Grid>
      </DialogTitle>
      <ManageInterests keywords={keywords} setKeywords={setKeywords} open={open} setOpen={setOpen}/>

    </Dialog>
  </>);
}
