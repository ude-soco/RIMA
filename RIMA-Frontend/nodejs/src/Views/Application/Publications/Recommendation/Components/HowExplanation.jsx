import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Legends from "./Legends";
import EmbeddingLegends from "./EmbeddingLegends";

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
import PropTypes from 'prop-types';
import HowStep from "./HowStep";
import HowFinalStep from "./HowFinalStep";



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
              shape: "rhomboid",
              borderStyle: "solid ",
              width:364,
              height: 70,
  
            },
            position: { x: 0, y: 50 },
          },
          {
            data: {
              id: "two",
              label: "PUBLICATION",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "solid ",
              width:364,
              height: 70,
            },
            position: { x: 700, y: 50 },
          },
          {
            data: {
              id: "three",
              label: "INTEREST",
              faveColor: "#303F9F",
              shape: "rhomboid",
              borderStyle: "solid",
              width:364,
              height: 70,
              tooltip:"<p>An interest from your<br />current interest model</p>"
            },
            position: { x: -100, y: 150 },
          },
          { data: { id: 'etc1' } ,
          classes:"etc",
          position: { x: 80, y: 150 },},
          {
            data: {
              id: "four",
              label: "INTEREST",
              faveColor: "#303F9F",
              shape: "rhomboid",
              borderStyle: "solid",
              width:364,
              height: 70,
              tooltip:"<p>An interest from your<br />current interest model</p>"

            },
            position: { x: 250, y: 150 },
          },
          {
            data: {
              id: "five",
              label: "PUBLICATION KEYWORD",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "solid",
              width:364,
              height: 70,
              tooltip:"<p>A publication keyword<br />extracted from the<br />current publication</p>"

            },
            position: { x: 600, y: 150 },
          },
          { data: { id: 'etc2' } ,
          classes:"etc",
          position: { x: 780, y: 150 },},
          {
            data: {
              id: "six",
              label: "PUBLICATION KEYWORD",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "solid",
              width:364,
              height: 70,
              tooltip:"<p>A publication keyword<br />extracted from the<br />current publication</p>"
            },
            position: { x: 950, y: 150 },
          },
          {
            data: {
              id: "seven",
              label: "EMBEDDING ",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Compution of the interest<br />embedding using SIFrank<br />algorithm</p>"

            },
            position: { x: -100, y: 250 },
          },
          { data: { id: 'etc3' } ,
          classes:"etc",
          position: { x: 80, y: 250 },},
          {
            data: {
              id: "eight",
              label: "EMBEDDING",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Compution of the interest<br />embedding using SIFrank<br />algorithm</p>"
            },
            position: { x: 250, y: 250 },
          },
          ,
          {
            data: {
              id: "nine",
              label: "EMBEDDING ",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Computation of the<br />publication keyword<br />embedding using SIFrank<br />algorithm</p>"

            },
            position: { x: 600, y: 250 },
          },
          { data: { id: 'etc4' } ,
          classes:"etc",
          position: { x: 780, y: 250 },},
          {
            data: {
              id: "ten",
              label: "EMBEDDING",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Computation of the<br />publication keyword<br />embedding using SIFrank<br />algorithm</p>"
            },
            position: { x: 950, y: 250 },
          },
          {
            data: {
              id: "eleven",
              label: "INTEREST EMBEDDING",
              faveColor: "#303F9F",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:364,
              height: 70,
              tooltip:"<p>An interest embedding is<br />a vector representation<br />of an interest</p>"
            },
            position: { x: -100, y: 350 },
          },
          { data: { id: 'etc5' } ,
          classes:"etc",
          position: { x: 80, y: 350 },},
          {
            data: {
              id: "twelve",
              label: "INTEREST EMBEDDING",
              faveColor: "#303F9F",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:364,
              height: 70,
              tooltip:"<p>An interest embedding is<br />a vector representation<br />of an interest</p>"
            },
            position: { x: 250, y: 350 },
          },
          {
            data: {
              id: "thirteen",
              label: "PUBLICATION KEYWORD EMBEDDING",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:400,
              height: 70,
              tooltip:"<p>A publication keyword<br />embedding is a vector<br />representation of a<br />publication keyword</p>"
            },
            position: { x: 600, y: 350 },
          },
          { data: { id: 'etc6' } ,
          classes:"etc",
          position: { x: 780, y: 350 },},
          {
            data: {
              id: "fourteen",
              label: "PUBLICATION KEYWORD EMBEDDING",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:400,
              height: 70,
              tooltip:"<p>A publication keyword<br />embedding is a vector<br />representation of a<br />publication keyword</p>"
            },
            position: { x: 950, y: 350 },
          },
          {
            data: {
              id: "fifteen",
              label: "WEIGHTED AVERAGE",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Computation of the<br />weighted average of all<br />interest embeddings </p>"
            },
            position: { x: 80, y: 450 },
          },
          {
            data: {
              id: "sixteen",
              label: "WEIGHTED AVERAGE",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Computation of the weighted<br />average of all publication<br />keyword embeddings </p>"
            },
            position: { x: 780, y: 450 },
          },
          {
            data: {
              id: "seventeen",
              label: "INTEREST MODEL EMBEDDING",
              faveColor: "#303F9F",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:370,
              height: 70,
              tooltip:"<p>An interest model<br />embedding is a vector<br />represenation of an<br />interest model</p>"
            },
            position: { x: 80, y: 550 },
          },
          {
            data: {
              id: "eighteen",
              label: "PUBLICATION EMBEDDING",
              faveColor: "#F39617",
              shape: "rhomboid",
              borderStyle: "dashed ",
              width:370,
              height: 70,
              tooltip:"<p>A publication embedding<br />is a vector represenation<br />of a publication</p>"
            },
            position: { x: 780, y: 550 },
          },
          {
            data: {
              id: "nineteen",
              label: "COSINE SIMILARITY",
              faveColor: "black",
              shape: "rectangle",
              borderStyle: "solid",
              width:200,
              height: 50,
              tooltip:"<p>Similarity is calculated<br />using cosine similarity<br />between the embeddings</p>"
            },
            position: { x: 430, y: 650 },
          },
          ,
          {
            data: {
              id: "twenty",
              label: "SIMILARITY SCORE:  "+state.paper.score+"%",
              faveColor: "black",
              shape: "rhomboid",
              borderStyle: "solid",
              width:370,
              height: 70,
            },
            position: { x: 430, y: 750 },
          },
          // edges
          { data: { source: "one", target: "three", label: "" ,faveColor: "#303F9F", lineStyle: "solid " } },
          { data: { source: "one", target: "four", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
          { data: { source: "two", target: "five", label: "", faveColor: "#F39617",lineStyle: "solid " } },
          { data: { source: "two", target: "six", label: "",faveColor: "#F39617", lineStyle: "solid " } },
          { data: { source: "three", target: "seven", label: "", faveColor: "#303F9F",lineStyle: "solid " } },
          { data: { source: "four", target: "eight", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
          { data: { source: "five", target: "nine", label: "", faveColor: "#F39617",lineStyle: "solid " } },
          { data: { source: "six", target: "ten", label: "",faveColor: "#F39617", lineStyle: "solid " } },
          { data: { source: "seven", target: "eleven", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "eight", target: "twelve", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "nine", target: "thirteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "ten", target: "fourteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "eleven", target: "fifteen", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "twelve", target: "fifteen", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "thirteen", target: "sixteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "fourteen", target: "sixteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "fifteen", target: "seventeen", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "sixteen", target: "eighteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "seventeen", target: "nineteen", label: "",faveColor: "#303F9F", lineStyle: "dashed " } },
          { data: { source: "eighteen", target: "nineteen", label: "",faveColor: "#F39617", lineStyle: "dashed " } },
          { data: { source: "nineteen", target: "twenty", label: "",faveColor: "black", lineStyle: "solid " } },
        ];
      var lessDetailFlowchart = [
      // nodes
      {
          data: {
          id: "one",
          label: "INTEREST MODEL",
          faveColor: "#303F9F",
          shape: "rhomboid",
          borderStyle: "solid ",
          width:332,
          height: 70,

          },
          position: { x: 100, y: 50 },
      },
      {
          data: {
          id: "two",
          label: "PUBLICATION",
          faveColor: "#F39617",
          shape: "rhomboid",
          borderStyle: "solid ",
          width: 332,
          height: 70,
          },
          position: { x: 500, y: 50 },
      },
      {
          data: {
          id: "thre",
          label: "INTERESTS",
          faveColor: "#303F9F",
          shape: "rhomboid",
          borderStyle: "solid ",
          width: 332,
          height: 70,
          tooltip:"<p>Interests from your<br />current interest<br />model</p>"
          },
          position: { x: 100, y: 200 },
      },
      {
          data: {
          id: "four",
          label: "KEYWORDS",
          faveColor: "#F39617",
          shape: "rhomboid",
          borderStyle: "solid ",
          width: 332,
          height: 70,
          tooltip:"<p>Publication keywords extracted<br />from the current publication</p>"
          },
          position: { x: 500, y: 200 },
      },
      {
          data: {
          id: "five",
          label: "INTEREST MODEL EMBEDDING",
          faveColor: "#303F9F",
          shape: "rhomboid",
          borderStyle: "dashed ",
          width: 332,
          height: 70,
          tooltip:"<p>An interest model embedding<br />is a vector representation of<br />an interest model</p>"
          },
          position: { x: 100, y: 350 },
      },
      {
          data: {
          id: "six",
          label: "PUBLICATION EMBEDDING",
          faveColor: "#F39617",
          shape: "rhomboid",
          borderStyle: "dashed ",
          width: 332,
          height: 70,
          tooltip:"<p>A publication embedding<br />is a vector representation<br />of a publication</p>"
          },
          position: { x: 500, y: 350 },
      },
      {
          data: {
          id: "seven",
          label: "SIMILARITY SCORE:  "+state.paper.score+"%",
          faveColor: "#000000",
          shape: "rhomboid",
          borderStyle: "solid ",
          width: 332,
          height: 70,
          },
          position: { x: 300, y: 500 },
      },
      // edges
      { data: { source: "one", target: "thre", label: "" ,faveColor: "#303F9F", lineStyle: "solid "} },
      { data: { source: "two", target: "four", label: "" ,faveColor: "#F39617", lineStyle: "solid "} },
      { data: { source: "thre", target: "five", label: "",faveColor: "#303F9F", lineStyle: "solid " } },
      { data: { source: "four", target: "six", label: "" ,faveColor: "#F39617", lineStyle: "solid"} },
      { data: { source: "six", target: "seven", label: "" ,faveColor: "#F39617", lineStyle: "dashed "} },
      { data: { source: "five", target: "seven", label: "" ,faveColor: "#303F9F", lineStyle: "dashed "} },
      ];

    const moreDetailFlowchartBox = <Flowchart elements={moreDetailFlowchart} height={400} xStartPoint={50}  yStartPoint={10} style={{border: "0.5px solid #E7E7E7",borderRadius: 8}}/>;
    const lessDetailFlowchartBox = <Flowchart elements={lessDetailFlowchart} height={400} xStartPoint={170}  yStartPoint={0} style={{border: "0.5px solid #E7E7E7",borderRadius: 8}}/>;

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
        {/*-----hoda-start---*/}
        <TabPanel style={{width:"73%"}} value={value===1 || value===2?1:value} index={1}>
          <HowStep
              interests={state.interests}
              keywords={state.paper.keyword}
              isSplit={false}
              inclEmbedding={value===2}
            />
          <EmbeddingLegends />
        </TabPanel>
        <TabPanel  style={{width:"73%"}} value={value} index={3}>
          <HowFinalStep paper={state.paper} />
          <EmbeddingLegends />
        </TabPanel>
        {/*-----hoda-end---*/}
      </>
    );

            // end Tannaz

    }



