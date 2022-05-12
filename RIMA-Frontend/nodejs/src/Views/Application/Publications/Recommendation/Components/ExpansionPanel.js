import React, { useEffect, useState } from "react";
import {
    ButtonGroup,
    Button as ButtonMUI,
    Collapse,
    Grid,
    makeStyles,
    Typography,
    CssBaseline,
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SettingsIcon from "@material-ui/icons/Settings";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
// import Flowchart from "../Components/Flowchart";
import Seperator from "./Seperator";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { WhatIfInterests } from './WhatIfInterests'
import { WhatIfKeywords } from './WhatIfKeywords'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    collapse: {
        backgroundColor: theme.palette.common.white,
    },
    collapseButton: {
        marginRight: "10px",
        display: "flex",
        justifyContent: "flex-end",
    },
    center: {
        display: "flex",
        justifyContent: "center ",
    },
}));

// Jaleh start
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </Grid>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
// Jaleh end
export default function ExpansionPanel(props) {
    // Tannaz start
    const [whyShow, setWhyShow] = useState(false);
    const [whatIfShow, setWhatIfShow] = useState(false);
    const [moreDetail, setMoreDetail] = useState(false);
    const [whyExpanded, setWhyExpanded] = useState(false);
    const [whatIfExpanded, setWhatIfExpanded] = useState(false);
    const [howExpanded, setHowExpanded] = useState(false);
    // Jaleh
    const paper = props.paper
    const interests = props.interests
    const index = props.index
    const threshold = props.threshold
    const [value, setValue] = useState(0);
    //   var moreDetailFlowchart = [
    //     // nodes
    //     {
    //       data: {
    //         id: "one",
    //         label: "Interest Model",
    //         faveColor: "#80b3ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 3, y: 30 },
    //     },
    //     {
    //       data: {
    //         id: "two",
    //         label: "Semantic Scholar API",
    //         faveColor: "#80b3ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 215, y: 30 },
    //     },
    //     {
    //       data: {
    //         id: "three",
    //         label: "Interests",
    //         faveColor: "#3385ff",
    //         shape: "diamond",
    //         width: 110,
    //       },
    //       position: { x: -100, y: 110 },
    //     },
    //     {
    //       data: {
    //         id: "four",
    //         label: "Split Keyphrase into Keywords",
    //         faveColor: "#3385ff",
    //         shape: "round-rectangle",
    //         width: 200,
    //       },
    //       position: { x: 110, y: 110 },
    //     },
    //     {
    //       data: {
    //         id: "five",
    //         label: "Keywords",
    //         faveColor: "#3385ff",
    //         shape: "diamond",
    //         width: 110,
    //       },
    //       position: { x: 330, y: 110 },
    //     },
    //     {
    //       data: {
    //         id: "six",
    //         label: "Word Embedding",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 120,
    //       },
    //       position: { x: -105, y: 190 },
    //     },
    //     {
    //       data: {
    //         id: "seven",
    //         label: "Word Embedding",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 120,
    //       },
    //       position: { x: 30, y: 190 },
    //     },
    //     {
    //       data: {
    //         id: "eight",
    //         label: "Word Embedding",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 120,
    //       },
    //       position: { x: 190, y: 190 },
    //     },
    //     {
    //       data: {
    //         id: "nine",
    //         label: "Word Embedding",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 120,
    //       },
    //       position: { x: 320, y: 190 },
    //     },
    //     {
    //       data: {
    //         id: "ten",
    //         label: "Interest Embeddings",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 130,
    //       },
    //       position: { x: -20, y: 260 },
    //     },
    //     {
    //       data: {
    //         id: "eleven",
    //         label: "Publication Keyword Embeddings",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 210,
    //       },
    //       position: { x: 250, y: 260 },
    //     },
    //     {
    //       data: {
    //         id: "twelve",
    //         label: "Cosine Similarity",
    //         faveColor: "#002966",
    //         shape: "round-rectangle",
    //         width: 120,
    //       },
    //       position: { x: 110, y: 350 },
    //     },
    //     // edges
    //     { data: { source: "one", target: "three", label: "Weighted Interests" } },
    //     { data: { source: "two", target: "five", label: "Weighted Interests" } },
    //     { data: { source: "three", target: "four", label: "No" } },
    //     { data: { source: "three", target: "six", label: "Yes" } },
    //     { data: { source: "five", target: "four", label: "No" } },
    //     { data: { source: "five", target: "nine", label: "Yes" } },
    //     { data: { source: "four", target: "seven", label: "Keyword" } },
    //     { data: { source: "four", target: "eight", label: "Keyword" } },
    //     { data: { source: "six", target: "ten", label: "Interest Embedding" } },
    //     { data: { source: "seven", target: "ten", label: "Interest Embeddings" } },
    //     {
    //       data: { source: "eight", target: "eleven", label: "Keyword Embeddings" },
    //     },
    //     { data: { source: "nine", target: "eleven", label: "Keyword Embedding" } },
    //     {
    //       data: {
    //         source: "ten",
    //         target: "twelve",
    //         label: "Weighted avg of all Interest Embeddings",
    //       },
    //     },
    //     {
    //       data: {
    //         source: "eleven",
    //         target: "twelve",
    //         label: "Weighted avg of all publication Keyword Embeddings",
    //       },
    //     },
    //   ];
    //   var lessDetailFlowchart = [
    //     // nodes
    //     {
    //       data: {
    //         id: "one",
    //         label: "Interest Model",
    //         faveColor: "#80b3ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 10, y: 50 },
    //     },
    //     {
    //       data: {
    //         id: "two",
    //         label: "Semantic Scholar API",
    //         faveColor: "#80b3ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 210, y: 50 },
    //     },
    //     {
    //       data: {
    //         id: "three",
    //         label: "Interests",
    //         faveColor: "#3385ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 10, y: 150 },
    //     },
    //     {
    //       data: {
    //         id: "four",
    //         label: "Keywords",
    //         faveColor: "#3385ff",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 210, y: 150 },
    //     },
    //     {
    //       data: {
    //         id: "five",
    //         label: "Word2Vec",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 10, y: 250 },
    //     },
    //     {
    //       data: {
    //         id: "six",
    //         label: "Word2Vec",
    //         faveColor: "#0052cc",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 210, y: 250 },
    //     },
    //     {
    //       data: {
    //         id: "seven",
    //         label: "Cosine Similarity",
    //         faveColor: "#002966",
    //         shape: "round-rectangle",
    //         width: 150,
    //       },
    //       position: { x: 110, y: 350 },
    //     },
    //     // edges
    //     { data: { source: "one", target: "three", label: "" } },
    //     { data: { source: "two", target: "four", label: "" } },
    //     { data: { source: "three", target: "five", label: "" } },
    //     { data: { source: "four", target: "six", label: "" } },
    //     { data: { source: "six", target: "seven", label: "" } },
    //     { data: { source: "five", target: "seven", label: "" } },
    //   ];

    const classes = useStyles();


    // const handleWhyExpandClick = () => {
    //     setWhyExpanded(!whyExpanded);
    //     setWhatIfExpanded(false);
    //     // Back Button:
    //     setWhyShow(!whyShow);
    //     setWhatIfShow(false);
    // };
    const handleWhatIfExpandClick = () => {
        setWhatIfExpanded(!whatIfExpanded);
        setWhyExpanded(false);
        // Back Button:
        setWhatIfShow(!whatIfShow);
        setWhyShow(false);
    };

    // Tannaz end
    // Jaleh Start
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    // Jaleh end
    return (
        // Tannaz start
        <>
            {/* <CssBaseline /> */}

            <Grid container spacing={2} className={classes.collapseButton}>
                 <ButtonGroup color="primary" variant="outlined" size='small'>
                    {/* <ButtonMUI
                        onClick={() => {
                            handleWhyExpandClick();
                        }}
                    >
                        Why?
                    </ButtonMUI> */}
                    <ButtonMUI
                        onClick={() => {
                            handleWhatIfExpandClick();
                        }}
                    >
                        What-If?
                    </ButtonMUI>
                </ButtonGroup>
            </Grid>

            {/* Handling th Back button */}

            {/* <Collapse in={whyExpanded} className={classes.collapse}>
                {whyShow && (
                    <Grid className="d-flex justify-content-start ">
                        <ButtonMUI
                            variant="string"
                            onClick={() => {
                                setWhyShow(false);
                                setWhyExpanded(!whyExpanded);
                            }}
                        >
                            <ArrowBackIosIcon color="action" fontSize="small" />
                            <Typography align="center" variant="subtitle2">
                                Back
                            </Typography>
                        </ButtonMUI>
                    </Grid>
                )} */}

            {/* Why visualizations */}
            {/* <Grid container className={classes.root} spacing={2}>
                    <Seperator Label="Why this publication?" Width="170" />

                    <Grid item md={12} className={classes.collapseButton}>
                        <ButtonMUI
                            variant="string"
                            size="small"
                            className="m-2 mr-4"
                            onClick={() => {
                                setHowExpanded(!howExpanded);
                            }}
                        >
                            <SettingsIcon color="action" fontSize="small" />
                            <Typography align="center" variant="subtitle2" className="ml-1">
                                How?
                            </Typography>
                        </ButtonMUI>{" "}
                    </Grid>

                    <Grid item md={8}>
                        <Grid style={{ width: "90%" }}>
                            Wordcloud */}
            {/* <ReplaceableCloudChart tags={props}/> */}
            {/* </Grid>
                    </Grid>
                    <Grid item md={4}>
                        Barchart
                    </Grid>
                </Grid> */}

            {/* How Visualizations */}
            {/* <Collapse in={howExpanded} className={classes.collapse}>
                    <Grid container className={classes.root} spacing={0}>
                        <Seperator Label="How the system works?" Width="200" />
                        <Grid item md={12} className={classes.collapseButton}>
                            {!moreDetail ? (
                                <ButtonMUI
                                    variant="string"
                                    size="small"
                                    className="m-2 mr-4"
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
                            ) : (
                                <ButtonMUI
                                    variant="string"
                                    size="small"
                                    className="m-2 mr-4"
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
                            )}
                        </Grid> */}
            {/* Left Category Buttons */}
            {/* <Grid item md={4} sm={12} className="mr-0 pr-0">
                            <Grid className="table-responsive-sm">
                                <table className="table">
                                    <tbody>
                                        <tr className="box">
                                            <td className="box-item interestsBox">
                                                <Typography
                                                    align="left"
                                                    variant="subtitle2"
                                                    className="arrowBox"
                                                >
                                                    Interests
                                                    <br />
                                                    Keywords
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr className="box">
                                            <td className="box-item dataBox">
                                                <Typography
                                                    align="left"
                                                    variant="subtitle2"
                                                    className="arrowBox"
                                                >
                                                    Data
                                                    <br />
                                                    Preprocess
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr className="box ">
                                            <td className="box-item embeddingsBox">
                                                <Typography
                                                    align="left"
                                                    variant="subtitle2"
                                                    className="arrowBox"
                                                >
                                                    Embeddings
                                                    <br />
                                                    Generation
                                                </Typography>
                                            </td>
                                        </tr>
                                        <tr className="box">
                                            <td className="box-item similarityBox">
                                                <Typography
                                                    align="left"
                                                    variant="subtitle2"
                                                    className="arrowBox"
                                                >
                                                    Similarity
                                                    <br />
                                                    Calculation
                                                </Typography>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Grid>
                        </Grid> */}
            {/* Right Flowchart */}
            {/* <Grid item md={8} sm={12} className="ml-0 pl-0">
                             {!moreDetail ? (
                                <Flowchart elements={lessDetailFlowchart} />
                            ) : (
                                <Flowchart elements={moreDetailFlowchart} />
                            )} 
                        </Grid>
                    </Grid>
                </Collapse>
            </Collapse> */}

            <Collapse in={whatIfExpanded} className={classes.collapse}>
                {whatIfShow && (
                    <Grid className="d-flex justify-content-start ">
                        <ButtonMUI
                            variant="outlined"
                            onClick={() => {
                                setWhatIfShow(false);
                                setWhatIfExpanded(!whatIfExpanded);
                            }}
                        >
                            <ArrowBackIosIcon color="action" fontSize="small" />
                            <Typography align="center" variant="subtitle2">
                                Back
                            </Typography>
                        </ButtonMUI>
                    </Grid>
                )}
                <Grid container className={classes.root} spacing={2}>
                    {/* What-if visualization */}

                    {/* <Seperator Label="What-if I change?" Width="170" /> */}
                    {/* Jaleh */}
                    <Grid container>
                        <Grid item md={12} style={{ borderBottom: '1px solid #2d3985', borderColor: '#2d3985', alignContent: 'center', margin: '0px 10px' }}>
                            <Tabs centered value={value} onChange={handleTabChange}
                                TabIndicatorProps={{
                                    style: { background: "#2d3985", height: '3px', borderRadius: '5', color: '#2d3985' }
                                }}>
                                <Tab label="What if 'interests' changed?" className='tab' />
                                <Tab label="What if 'Keywords' changed?" className='tab' />
                            </Tabs>
                        </Grid>
                        <TabPanel value={value} index={0}>
                            <WhatIfInterests paper={paper} interests={interests} index={index} threshold={threshold} handleApplyWhatIfChanges={props.handleApplyWhatIfChanges}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <WhatIfKeywords paper={paper} interests={interests} index={index} threshold={threshold} handleApplyWhatIfChanges={props.handleApplyWhatIfChanges}/>
                        </TabPanel>
                    </Grid>
                </Grid>
            </Collapse>
        </>

        // Tannaz end
    );
}
