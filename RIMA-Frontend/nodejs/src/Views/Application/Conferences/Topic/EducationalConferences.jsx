// Implemented By Abdallah
import NewAuthorBar from "../../../components/LAKForms/NewAuthorBar_BAK";
import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Paper,
  Fade,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
} from "@material-ui/core";
import NewSharedAuthorEvolution from "../../../components/LAKForms/NewSharedAuthorEvolution_BAK";
import NewCompareAuthorsPapersCol from "../../../components/LAKForms/NewCompareAuthorsPapersCol";
import NewNumberOfSharedWords from "../../../components/LAKForms/NewNumberOfSharedWords_BAK";
import NewEvolutionTopTopics from "../../../components/LAKForms/NewEvolutionTopTopics";
import NewComparePapers from "../../../components/LAKForms/NewComparePapers";
import NewSharedAuthors from "../../../components/LAKForms/NewSharedAuthors_BAK";
import NewSharedWords from "../../../components/LAKForms/NewSharedWords";
import NewCompareTopicsInPapers from "../../../components/LAKForms/NewCompareTopicsInPapers_BAK";
import NewTopWordsInYears from "../../../components/LAKForms/NewTopWordsInYears";
import NewSilmilarityEvolution from "../../../components/LAKForms/NewSilmilarityEvolution.jsX";
import NewCompareStackedBarChart from "../../../components/LAKForms/NewCompareStackedBarChart_BAK";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
// import {Settings, ExpandMoreIcon} from "@material-ui/icons";
import { useHistory } from "react-router-dom";
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// // import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import RestAPI from "../../../../Services/api";

import { Card, CardHeader, Row, Col } from "reactstrap";
window.$value = "";
var selectInputRef = React.createRef();

const useStyles = makeStyles((theme) => ({
  padding: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  gutter: {
    marginBottom: theme.spacing(2),
  },
  gutterLarge: {
    marginBottom: theme.spacing(11),
  },
  tabPanel: {
    marginBottom: theme.spacing(7),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  header: {
    marginBottom: theme.spacing(8),
  },
  headerAlt: {
    margin: theme.spacing(3, 0, 4, 0),
  },
  cardHeight: {
    height: "100%",
    width: "100%",
    background: "White",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(5),
    marginBottom: 24,
    background: "white",
    border: "15px",
  },
  cardHeight2: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(7),
    marginBottom: 14,

    cursor: "pointer",
    background: "white",
  },
  cardHeight3: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(7),
    marginBottom: 14,
    cursor: "pointer",
    background: "#F5F5F2",
  },
  headers: {
    width: "1000px",
    marginLeft: "10px",
    marginRight: "10px",
    borderRadius: "2px",
  },
  cardHeightAlt: {
    height: "105%",
    padding: theme.spacing(4, 4, 0, 4),
    // borderRadius: theme.spacing(4, 4, 0, 0),
    borderRadius: theme.spacing(2),
    marginBottom: 24,
  },
  listIcon: {
    paddingLeft: theme.spacing(2),
  },
}));

// const el = document.getElementsByClassName("myHeader");
// div.addEventListener('mouseenter',() =>
//   el.style.background = '#FF0000');

export default function EducationalConferences(props) {
  const [availableConferences, setavailableConferences] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openDrawerAuthor, setOpenDrawerAuthor] = useState(true);
  const [openDrawerYears, setOpenDrawerYears] = useState(true);
  const [openDrawerPaper, setOpenDrawerPaper] = useState(true);
  const [openDrawerWords, setOpenDrawerWords] = useState(true);
  const [openDrawerActivity, setOpenDrawerActivity] = useState(true);
  const [openDrawerh, setOpenDrawerh] = useState(false);
  const [openDrawerh2, setOpenDrawerh2] = useState(true);
  const [mulitSelectDefaultValues, setmulitSelectDefaultValues] = useState([
    { value: "lak", label: "lak" },
    { value: "aied", label: "aied" },
    { value: "edm", label: "edm" },
  ]);

  function changeBackground(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackground2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawer === false){
    //   e.target.style.background = '#F5F5F2';
    // }
    // else {
    //   e.target.style.background = '#B0D4FF';
    // }
  }
  function handleClick(e) {
    setOpenDrawer(!openDrawer);
  }

  function changeBackgroundAuthor(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundAuthor2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawerAuthor === false){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = '#F5F5F2';
    // }
  }
  function handleClickAuthor(e) {
    setOpenDrawerAuthor(!openDrawerAuthor);
  }

  function changeBackgroundYears(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundYears2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawerYears === false){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = '#F5F5F2';
    // }
  }
  function handleClickYears(e) {
    setOpenDrawerYears(!openDrawerYears);
  }

  function changeBackgroundh(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundh2(e) {
    e.target.style.background = "white";
    // if(openDrawerh === true){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = 'white';
    // }
  }
  function changeBackgroundhh2(e) {
    e.target.style.background = "white";
    // if(openDrawerh2 === true){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = 'white';
    // }
  }

  function handleClickh(e) {
    setOpenDrawerh(!openDrawerh);
    setOpenDrawerh2(!openDrawerh2);
  }
  function handleClickh2(e) {
    setOpenDrawerh2(!openDrawerh2);
  }

  function changeBackgroundPaper(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundPaper2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawerPaper === false){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = '#F5F5F2';
    // }
  }
  function handleClickPaper(e) {
    setOpenDrawerPaper(!openDrawerPaper);
  }

  function changeBackgroundWords(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundWords2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawerWords === false){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = '#F5F5F2';
    // }
  }
  function handleClickWords(e) {
    setOpenDrawerWords(!openDrawerWords);
  }

  function changeBackgroundActivity(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundActivity2(e) {
    e.target.style.background = "#F5F5F2";
    // if(openDrawerActivity === false){
    //   e.target.style.background = '#B0D4FF';
    // }
    // else {
    //   e.target.style.background = '#F5F5F2';
    // }
  }
  function handleClickActivity(e) {
    setOpenDrawerActivity(!openDrawerActivity);
  }
  function conferenceshandleChange(e) {
    setmulitSelectDefaultValues(true);
  }

  useEffect(() => {
    getConferencesNames();
  }, []);

  //** GET ALL CONFERENCES **//
  const getConferencesNames = () => {
    RestAPI.getConferencesNames().then((response) => {
      setavailableConferences(response.data);
    });
  };

  return (
    <>
      <Grid container component={Paper} className={classes.cardHeight}>
        <h2>
          {" "}
          Get insights about Educational Data Science Conferences from different
          perspectives.{" "}
        </h2>
        {/* <Select
                ref={selectInputRef}
                name="selectOptions"
                isClearable
                isMulti
                placeholder="Select conf Option"
                options={["Similarity", "Paper"]}
                onChange={conferenceshandleChange}
                style={{width: "100%",
                      height:"100%"}}

            /> */}
        {/* <Accordion container component={Paper} className={classes.cardHeight3}>
        <AccordionSummary
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion> */}
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawer}
            onMouseEnter={changeBackground}
            onMouseLeave={changeBackground2}
            onClick={handleClick}
          >
            Similarity
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawer ? 4 : ""}
            style={{ display: openDrawer ? "block" : "none", hight: "20%" }}
          >
            <Fade unmountOnExit in={openDrawer}>
              <CardHeader className="bg-transparent">
                {/* <Row >                   
                    <h2>                    
                      The following visualizations show the similarity of selected conferences over years with different levels of detail.
                    </h2>

                </Row> */}
                <Row>
                  <div className="main"></div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "98%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewSilmilarityEvolution
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "48%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewSharedAuthorEvolution
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "48%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewNumberOfSharedWords
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawerYears}
            onMouseEnter={changeBackgroundYears}
            onMouseLeave={changeBackgroundYears2}
            onClick={handleClickYears}
          >
            {" "}
            Trends{" "}
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawerYears ? 4 : ""}
            style={{
              display: openDrawerYears ? "block" : "none",
              hight: "20%",
              width: "100%",
            }}
          >
            <Fade unmountOnExit in={openDrawerYears}>
              <CardHeader className="bg-transparent">
                {/* <Row>                
                    <h2 className={classes.headers}> The following visualizations show insights about the top topics/keywords in the last Five years</h2>
                </Row> */}
                <Row>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "48%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewTopWordsInYears
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "48%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewEvolutionTopTopics
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                </Row>
                <div checked={openDrawerh2}>
                  <Fade unmountOnExit in={openDrawerh2}>
                    <h3
                      style={{ width: "100%" }}
                      checked={openDrawerh}
                      onMouseEnter={changeBackgroundh}
                      onMouseLeave={changeBackgroundh2}
                      onClick={handleClickh}
                    >
                      {" "}
                      + click here to use these visualizations to compare
                      between conferences{" "}
                    </h3>
                    {/* <Button  
                    outline
                   active={openDrawerh}
                    color="primary"
                     onClick={handleClickh}>
                    + click here to use these visualizations to compare between conferences
                     </Button> */}
                  </Fade>
                </div>
                <Fade unmountOnExit in={openDrawerh}>
                  <div
                    className="bg-gradient-default1 shadow"
                    lg={openDrawerh ? 4 : ""}
                    style={{ display: openDrawerh ? "block" : "none" }}
                  >
                    <Row>
                      <div
                        className="row mt-4"
                        style={{
                          display: "flex",
                          height: "50%",
                          width: "48%",
                          backgroundColor: "#F0F8FF",
                          marginLeft: "1%",
                          marginRight: "1%",
                          borderRadius: "2px",
                        }}
                      >
                        <Col>
                          <NewTopWordsInYears
                            conferencesNames={availableConferences}
                          />
                        </Col>
                      </div>
                      <div
                        className="row mt-4"
                        style={{
                          display: "flex",
                          height: "50%",
                          width: "48%",
                          backgroundColor: "#F0F8FF",
                          marginLeft: "1%",
                          marginRight: "1%",
                          borderRadius: "2px",
                        }}
                      >
                        <Col>
                          <NewEvolutionTopTopics
                            conferencesNames={availableConferences}
                          />
                        </Col>
                      </div>
                    </Row>
                    <Button
                      outline
                      active={openDrawerh2}
                      color="primary"
                      onClick={handleClickh}
                    >
                      - click here to shrink comparison
                    </Button>
                  </div>
                </Fade>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawerAuthor}
            onMouseEnter={changeBackgroundAuthor}
            onMouseLeave={changeBackgroundAuthor2}
            onClick={handleClickAuthor}
          >
            {" "}
            Authors{" "}
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawerAuthor ? 4 : ""}
            style={{
              display: openDrawerAuthor ? "block" : "none",
              width: "100%",
            }}
          >
            <Fade unmountOnExit in={openDrawerAuthor}>
              <CardHeader className="bg-transparent">
                {/* <Row>                
                    <h2 className="text-white1 mb-0">Comparison between conferences from authors prespective</h2>

                </Row> */}
                <Row>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "720px",
                      width: "80%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "10%",
                      marginRight: "10%",
                      marginBottom: "2%",
                      marginTop: "3%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewSharedAuthors
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "50%",
                      width: "80%",
                      backgroundColor: "#F0F8FF",
                      marginTop: "2%",
                      marginLeft: "10%",
                      marginRight: "10%",
                      marginBottom: "2%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewAuthorBar conferencesNames={availableConferences} />
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawerPaper}
            onMouseEnter={changeBackgroundPaper}
            onMouseLeave={changeBackgroundPaper2}
            onClick={handleClickPaper}
          >
            {" "}
            Publications{" "}
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawerPaper ? 4 : ""}
            style={{
              display: openDrawerPaper ? "block" : "none",
              width: "100%",
            }}
          >
            <Fade unmountOnExit in={openDrawerPaper}>
              <CardHeader className="bg-transparent">
                {/* <Row>
                    <h2 className="text-white1 mb-0">The following visualizations compare topics/keywords in papers of selected conference events</h2>
                </Row> */}
                <Row>
                  <div
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "58%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewComparePapers
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      height: "55%",
                      width: "38%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "1%",
                      marginRight: "1%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewCompareTopicsInPapers
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawerWords}
            onMouseEnter={changeBackgroundWords}
            onMouseLeave={changeBackgroundWords2}
            onClick={handleClickWords}
          >
            {" "}
            Events{" "}
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawerWords ? 4 : ""}
            style={{
              display: openDrawerWords ? "block" : "none",
              width: "100%",
            }}
          >
            <Fade unmountOnExit in={openDrawerWords}>
              <CardHeader className="bg-transparent">
                {/* <Row>                
                    <h2 className="text-white1 mb-0">Comparison between conferences from topics and keywrods perspective </h2>

                </Row> */}
                <Row>
                  <div
                    style={{
                      display: "flex",
                      height: "720px",
                      width: "80%",
                      backgroundColor: "#F0F8FF",
                      marginLeft: "10%",
                      marginRight: "10%",
                      marginBottom: "2%",
                      marginTop: "3%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewSharedWords conferencesNames={availableConferences} />
                    </Col>
                  </div>
                  <div
                    className="row mt-4"
                    style={{
                      display: "flex",
                      height: "50%",
                      width: "80%",
                      backgroundColor: "#F0F8FF",
                      marginTop: "2%",
                      marginLeft: "10%",
                      marginRight: "10%",
                      marginBottom: "2%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewCompareStackedBarChart
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ width: "100%" }}
            checked={openDrawerActivity}
            onMouseEnter={changeBackgroundActivity}
            onMouseLeave={changeBackgroundActivity2}
            onClick={handleClickActivity}
          >
            {" "}
            Activity
          </h1>
          <Card
            className="bg-gradient-default1 shadow"
            lg={openDrawerActivity ? 4 : ""}
            style={{
              display: openDrawerActivity ? "block" : "none",
              width: "100%",
            }}
          >
            <Fade unmountOnExit in={openDrawerActivity}>
              <CardHeader className="bg-transparent">
                <Row>
                  <div
                    style={{
                      display: "flex",
                      height: "50%",
                      width: "100%",
                      backgroundColor: "#F0F8FF",
                      marginTop: "2%",
                      marginLeft: "5%",
                      marginRight: "5%",
                      marginBottom: "2%",
                      borderRadius: "2px",
                    }}
                  >
                    <Col>
                      <NewCompareAuthorsPapersCol
                        conferencesNames={availableConferences}
                      />
                    </Col>
                  </div>
                </Row>
              </CardHeader>
            </Fade>
          </Card>
        </Grid>
        <ScrollTopWrapper />
      </Grid>
    </>
  );
}
