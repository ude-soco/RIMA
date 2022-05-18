import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Legends from "./Legends";

const textMetrics = require("text-metrics");
const el = document.querySelector("h5");
const metrics = textMetrics.init(el);

import {  
    Button as ButtonMUI,
    Grid,  
    Typography,
    Tabs,
    Tab,
    Box,

     } from "@material-ui/core";
import Flowchart from "./Flowchart";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import PropTypes from 'prop-types';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    display: "flex !important",
    justifyContent: "space-evenly !important",
  },  
  TabPanel: {
    width: "100%",

  },
  collapseButton: {
    width: "100%",
    display: "flex",
      justifyContent: "flex-end",
    },
    checkboxLabel: {
      fontSize:"16pt"
      },

}));
  

export default function HowExplanation(props) {


    // start Tannaz
    const classes = useStyles();

    // states
      const [state, setState] = useState({
        paper: props.paper,
        interests: props.interests,
        index: props.index,
    })
  
    // console.log(state.paper);
    // console.log(state.interests);
    // console.log(state.index);
  
    const [moreDetail, setMoreDetail] = useState(false);

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  


        // data
      var moreDetailFlowchart = [
          // nodes
          {
            data: {
              id: "one",
              label: "INTEREST MODEL",
              faveColor: "#303F9F",
              shape: "round-rectangle",
              borderStyle: "solid ",
              width: metrics.width( "INTEREST MODEL" ),
            },
            position: { x: 100, y: 0 },
          },
          {
            data: {
              id: "two",
              label: "PUBLICATION",
              faveColor: "#F39617",
              shape: "round-rectangle",
              borderStyle: "solid ",
              width: metrics.width( "PUBLICATION" ),
            },
            position: { x: 600, y: 0 },
          },
          {
            data: {
              id: "three",
              label: "INTEREST (KEYWORD)",
              faveColor: "#303F9F",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "INTEREST (KEYWORD)" ),
              tooltip:"<p>An interet keyword embedding<br />is a vector representation of an<br />interest keyword</p>"
            },
            position: { x: -50, y: 150 },
          },
          {
            data: {
              id: "five",
              label: "INTEREST (KEYWORD)",
              faveColor: "#303F9F",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "INTEREST (KEYWORD)" ),
            },
            position: { x: 250, y: 200 },
          },
          {
            data: {
              id: "six",
              label: "PUBLICATION KEYWORD ",
              faveColor: "#F39617",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "PUBLICATION KEYWORD" ),
            },
            position: { x: 450, y: 150 },
          },
          {
            data: {
              id: "eight",
              label: "PUBLICATION KEYWORD",
              faveColor: "#F39617",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "PUBLICATION KEYWORD" ),
              tooltip:"<p>A publication keyword embedding<br />is a vector representation of a<br />publication keyword</p>"
            },
            position: { x: 750, y: 200 },
          },
          {
            data: {
              id: "nine",
              label: "INTEREST MODEL ",
              faveColor: "#303F9F",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "INTEREST MODEL " ),
              tooltip:"<p>An interest embedding is a<br />vector represenation of an<br />interest</p>"

            },
            position: { x: 100, y: 300 },
          },
          {
            data: {
              id: "ten",
              label: "PUBLICATION",
              faveColor: "#F39617",
              shape: "round-rectangle",
              borderStyle: "dashed",
              width: metrics.width( "PUBLICATION" ),
              tooltip:"<p>A publication embedding is a<br />vector represenation of a<br />publication</p>"
            },
            position: { x: 600, y: 300 },
          },
          {
            data: {
              id: "eleven",
              label: "SIMILARITY SCORE:  "+state.paper.score+"%",
              faveColor: "#000000",
              shape: "round-rectangle",
              borderStyle: "solid ",
              width: metrics.width( "SIMILARITY SCORE"+state.paper.score+"%" ),
              tooltip:"<p>Similarity is calculated using<br />cosine similarity between two<br />model embeddings</p>"
            },
            position: { x: 350, y: 400 },
          },
          // edges
          { data: { source: "one", target: "three", label: "Interests (keywords / keyphrases)" ,faveColor: "#303F9F", lineStyle: "solid " } },
          { data: { source: "one", target: "five", label: "Interests (keywords / keyphrases)",faveColor: "#303F9F", lineStyle: "solid " } },
          { data: { source: "two", target: "six", label: "publication keywords / keyphrases", faveColor: "#F39617",lineStyle: "solid " } },
          { data: { source: "two", target: "eight", label: "publication keywords / keyphrases",faveColor: "#F39617", lineStyle: "solid " } },
          { data: { source: "three", target: "nine", label: "weighted average",faveColor: "#303F9F", lineStyle: "dashed " ,
          tooltip:"<p>Compute an interest embedding as<br />a weighted average of all interests<br />keyphrase / keyword embeddings </p>"
        } },
          { data: { source: "five", target: "nine", label: "weighted average" ,faveColor: "#303F9F", lineStyle: "dashed "} },
          { data: { source: "six", target: "ten", label: "weighted average",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "eight", target: "ten", label: "weighted average",faveColor: "#F39617", lineStyle: "dashed " , 
          tooltip:"<p>Compute a publication embedding as<br />a weighted average of all publication<br />keyphrase / keyword embeddings </p>"
        } },
          { data: { source: "nine", target: "eleven", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "ten", target: "eleven", label: "", faveColor: "#F39617",lineStyle: "dashed " } }
        ];
      var lessDetailFlowchart = [
      // nodes
      {
          data: {
          id: "one",
          label: "INTEREST MODEL",
          faveColor: "#303F9F",
          shape: "round-rectangle",
          borderStyle: "solid ",
          width: metrics.width( "INTEREST MODEL" ),
          },
          position: { x: 110, y: 50 },
      },
      {
          data: {
          id: "two",
          label: "SEMANTIC SCHOLAR API",
          faveColor: "#F39617",
          shape: "round-rectangle",
          borderStyle: "solid ",
          width: metrics.width( "SEMANTIC SCHOLAR API" ),
          },
          position: { x: 310, y: 50 },
      },
      {
          data: {
          id: "thre",
          label: "INTEREST (KEYWORD / KEYPHRASE)",
          faveColor: "#303F9F",
          shape: "rectangle",
          borderStyle: "solid ",
          width: metrics.width( "INTEREST (KEYWORD / KEYPHRASE)" ),
          },
          position: { x: 50, y: 150 },
      },
      {
          data: {
          id: "four",
          label: "PUBLICATION (KEYWORD / KEYPHRASE)",
          faveColor: "#F39617",
          shape: "rectangle",
          borderStyle: "solid ",
          width: metrics.width( "PUBLICATION (KEYWORD / KEYPHRASE)" ),
          },
          position: { x: 410, y: 150 },
      },
      {
          data: {
          id: "five",
          label: "Word2Vec",
          faveColor: "#303F9F",
          shape: "rectangle",
          borderStyle: "dashed ",
          width: metrics.width( "Word2Vec" ),
          tooltip:"<p>An interet embedding will be<br />created via Word2Vec</p>"
          },
          position: { x: 110, y: 250 },
      },
      {
          data: {
          id: "six",
          label: "Word2Vec",
          faveColor: "#F39617",
          shape: "rectangle",
          borderStyle: "dashed ",
          width: metrics.width( "Word2Vec" ),
          tooltip:"<p>A keyword embedding will be<br />created via Word2Vec</p>"
          },
          position: { x: 310, y: 250 },
      },
      {
          data: {
          id: "seven",
          label: "COSINE SIMILARITY",
          faveColor: "#000000",
          shape: "round-rectangle",
          borderStyle: "solid ",
          width: metrics.width( "COSINE SIMILARITY" ),
          tooltip:"<p>Similarity is calculated using<br />cosine similarity between two<br /> embeddings</p>"
          },
          position: { x: 210, y: 350 },
      },
      // edges
      { data: { source: "one", target: "thre", label: "" ,faveColor: "#303F9F", lineStyle: "solid "} },
      { data: { source: "two", target: "four", label: "" ,faveColor: "#F39617", lineStyle: "solid "} },
      { data: { source: "thre", target: "five", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
      { data: { source: "four", target: "six", label: "" ,faveColor: "#F39617", lineStyle: "solid"} },
      { data: { source: "six", target: "seven", label: "" ,faveColor: "#F39617", lineStyle: "dashed "} },
      { data: { source: "five", target: "seven", label: "" ,faveColor: "#303F9F", lineStyle: "dashed "} },
      ];

    const moreDetailFlowchartBox = <Flowchart elements={moreDetailFlowchart} height={400} xStartPoint={50}  yStartPoint={10}/>;
    const lessDetailFlowchartBox = <Flowchart elements={lessDetailFlowchart} height={400} xStartPoint={170}  yStartPoint={0}/>;

    return (

      <>
      <Tabs
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        disableFocusRipple="true"
        disableRipple="true"
        centered
      >
        <Tab label="OVERVIEW" {...a11yProps(0)} />
        <Tab label="GET USER INTERESTS AND PUBLICATION KEYWORDS / KEYPHRASES" {...a11yProps(1)} />
        <Tab label="GENERATE EMBEDDINGS" {...a11yProps(2)} />
        <Tab label="COMPUTE SIMILARITY" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid container spacing={0}>
            <Grid item md={12} > 
              {!moreDetail ?
                <ButtonMUI
                  variant="string"
                  size="small"
                  className={classes.collapseButton}
                  onClick={() => {
                    setMoreDetail(true);
                  }}
                >
                  <AddCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    More
                  </Typography>
                </ButtonMUI>
                :
                <ButtonMUI
                  variant="string"
                  size="small"
                  className={classes.collapseButton}
                  onClick={() => {
                    setMoreDetail(false);
                  }}
                >
                  <RemoveCircleOutlineIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    Less
                  </Typography>
                </ButtonMUI>
              }
              {moreDetail ? moreDetailFlowchartBox : lessDetailFlowchartBox}
               <Legends />
            </Grid> 
          </Grid>

        </TabPanel>
        <TabPanel value={value} index={1}>
        Item Two

        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
      </>
    );

            // end Tannaz

    }



