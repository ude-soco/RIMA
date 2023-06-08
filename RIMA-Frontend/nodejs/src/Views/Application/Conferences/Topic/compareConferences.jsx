// Updated By Islam Abdelghaffar
import NewAuthorBar from "../../../components/LAKForms/NewAuthorBar.jsx";
import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Paper,
  Fade,
  Card,
  CardContent,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  useMediaQuery,
} from "@material-ui/core";
import NewSharedAuthorEvolution from "../../../components/LAKForms/NewSharedAuthorEvolution.jsx";
import NewCompareAuthorsPapersCol from "../../../components/LAKForms/NewCompareAuthorsPapersCol.jsx";
import NewNumberOfSharedWords from "../../../components/LAKForms/NewNumberOfSharedWords.jsx";
import NewEvolutionTopTopics from "../../../components/LAKForms/NewEvolutionTopTopics";
import NewComparePapers from "../../../components/LAKForms/NewComparePapers.jsx";
import NewSharedAuthors from "../../../components/LAKForms/NewSharedAuthors.jsx";
import NewSharedWords from "../../../components/LAKForms/NewSharedWords";
import NewCompareTopicsInPapers from "../../../components/LAKForms/NewCompareTopicsInPapers";
import NewTopWordsInYears from "../../../components/LAKForms/NewTopWordsInYears";
import NewSilmilarityEvolution from "../../../components/LAKForms/NewSilmilarityEvolution.jsx";
import NewCompareStackedBarChart from "../../../components/LAKForms/NewCompareStackedBarChart.jsx";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";
import { useHistory } from "react-router-dom";

import CompareStackedAreaChart from "../../../components/LAKForms/compareStackedAreaChart.jsx";

import RestAPI from "../../../../Services/api";

import { CardHeader, Row, Col } from "reactstrap";
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
  }
  function handleClick(e) {
    setOpenDrawer(!openDrawer);
  }

  function changeBackgroundAuthor(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundAuthor2(e) {
    e.target.style.background = "#F5F5F2";
  }
  function handleClickAuthor(e) {
    setOpenDrawerAuthor(!openDrawerAuthor);
  }

  function changeBackgroundYears(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundYears2(e) {
    e.target.style.background = "#F5F5F2";
  }
  function handleClickYears(e) {
    setOpenDrawerYears(!openDrawerYears);
  }

  function changeBackgroundPaper(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundPaper2(e) {
    e.target.style.background = "#F5F5F2";
  }
  function handleClickPaper(e) {
    setOpenDrawerPaper(!openDrawerPaper);
  }

  function changeBackgroundWords(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundWords2(e) {
    e.target.style.background = "#F5F5F2";
  }
  function handleClickWords(e) {
    setOpenDrawerWords(!openDrawerWords);
  }

  function changeBackgroundActivity(e) {
    e.target.style.background = "#B0D4FF";
  }
  function changeBackgroundActivity2(e) {
    e.target.style.background = "#F5F5F2";
  }
  function handleClickActivity(e) {
    setOpenDrawerActivity(!openDrawerActivity);
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
  const Style = {
    itemStyle: {
      backgroundColor: "#F0F8FF",
      borderRadius: "40px",
      padding: "1%",
    },
    cardStyle: {
      width: "100%",
      borderRadius: "40px",
    },
    h1Style: {
      width: "100%",
      borderRadius: "40px",
    },
  };
  return (
    <>
      <Grid container component={Paper} className={classes.cardHeight}>
        <h2>
          {" "}
          Get insights about Educational Data Science Conferences from different
          perspectives.{" "}
        </h2>

        {/* overview */}
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ ...Style.h1Style }}
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
              ...Style.cardStyle,
              display: openDrawerActivity ? "block" : "none",
            }}
          >
            <Fade unmountOnExit in={openDrawerActivity}>
              <CardContent className="bg-transparent">
                <Grid
                  container
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#F0F8FF",
                    borderRadius: "40px",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      margin: "1%",
                    }}
                  >
                    <NewCompareAuthorsPapersCol
                      conferencesNames={availableConferences}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        {/* similarity */}
        <Grid
          container
          component={Paper}
          className={classes.cardHeight3}
          style={{ width: "100%" }}
        >
          <h1
            style={{ ...Style.h1Style }}
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
            style={{
              display: openDrawer ? "block" : "none",
              hight: "20%",
              ...Style.cardStyle,
            }}
          >
            <Fade unmountOnExit in={openDrawer}>
              <CardContent className="bg-transparent">
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    style={{
                      ...Style.itemStyle,
                    }}
                  >
                    <NewSilmilarityEvolution
                      conferencesNames={availableConferences}
                    />
                  </Grid>
                  <Grid
                    container
                    style={{
                      marginTop: "1%",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{
                        ...Style.itemStyle,
                      }}
                    >
                      <NewSharedAuthorEvolution
                        conferencesNames={availableConferences}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{
                        ...Style.itemStyle,
                        marginLeft: "1%",
                        width: "49%",
                      }}
                    >
                      <NewNumberOfSharedWords
                        conferencesNames={availableConferences}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        {/* trends */}
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ ...Style.h1Style }}
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
              ...Style.cardStyle,
              display: openDrawerYears ? "block" : "none",
            }}
          >
            <Fade unmountOnExit in={openDrawerYears}>
              <CardContent className="bg-transparent">
                <Grid container className="bg-transparent">
                  <Grid
                    item
                    xs={12}
                    md={12}
                    style={{
                      ...Style.itemStyle,
                    }}
                  >
                    <CompareStackedAreaChart
                      conferencesNames={availableConferences}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        {/* Authors */}
        <Grid
          container
          component={Paper}
          className={classes.cardHeight3}
          style={{ width: "100%" }}
        >
          <h1
            style={{ ...Style.h1Style }}
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
              ...Style.cardStyle,
              display: openDrawerAuthor ? "block" : "none",
            }}
          >
            <Fade unmountOnExit in={openDrawerAuthor}>
              <CardContent className="bg-transparent">
                <Grid container className="bg-transparent">
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{
                      ...Style.itemStyle,
                    }}
                  >
                    <NewSharedAuthors conferencesNames={availableConferences} />
                  </Grid>
                  <Grid
                    item
                    md={12}
                    style={{
                      ...Style.itemStyle,
                      marginTop: "1%",
                    }}
                  >
                    <NewAuthorBar conferencesNames={availableConferences} />
                  </Grid>
                </Grid>{" "}
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        {/* publications */}
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ ...Style.h1Style }}
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
              borderRadius: "40px",
            }}
          >
            <Fade unmountOnExit in={openDrawerPaper}>
              <CardContent className="bg-transparent">
                <Grid container md={12} xs={12}>
                  <Grid
                    md={12}
                    xs={12}
                    item
                    style={{
                      ...Style.itemStyle,
                    }}
                  >
                    <NewComparePapers conferencesNames={availableConferences} />
                  </Grid>
                </Grid>
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        {/* Events */}
        <Grid container component={Paper} className={classes.cardHeight3}>
          <h1
            style={{ ...Style.h1Style }}
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
              borderRadius: "40px",
            }}
          >
            <Fade unmountOnExit in={openDrawerYears}>
              <CardContent className="bg-transparent">
                <Grid container xs={12} md={12}>
                  <Grid
                    xs={12}
                    md={12}
                    item
                    style={{
                      ...Style.itemStyle,
                    }}
                  >
                    <NewCompareStackedBarChart
                      conferencesNames={availableConferences}
                    />
                  </Grid>

                  <Grid
                    xs={12}
                    md={12}
                    item
                    style={{
                      ...Style.itemStyle,
                      marginTop: "1%",
                    }}
                  >
                    <NewCompareTopicsInPapers
                      conferencesNames={availableConferences}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Fade>
          </Card>
        </Grid>

        <ScrollTopWrapper />
      </Grid>
    </>
  );
}
