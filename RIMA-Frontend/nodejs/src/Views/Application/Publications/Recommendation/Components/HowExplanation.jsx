import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {  
    Button as ButtonMUI,
    Grid,  
    Typography,
    Table ,
    TableBody,
    TableCell ,
    TableContainer ,
    TableHead ,
    TableRow 
     } from "@material-ui/core";
import Flowchart from "../Components/Flowchart";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
// styles
const useStyles = makeStyles({
    head: {
        width:"100%",
        backgroundColor: "rgb(87, 87, 87)",
        border:"1px solid #b9b7be"
      },
    table: {
      minWidth: 150,
      border: "1px solid #b9b7be"
    },  
    collapseButton: {
        margin: "10px",
        display: "flex",
        justifyContent: "flex-end",
      },
  });
  

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

    const [showDetailButton, setShowDetailButton] = useState(true);
    const [moreDetail, setMoreDetail] = useState(false);
    const [activeInterestButton, setActiveInterest] = useState(false);
    const [activeDataButton, setActiveData] = useState(false);
    const [activeEmbeddingButton, setActiveEmbedding] = useState(false);
    const [activeSimilarityButton, setActiveSimilarity] = useState(false);


    //Method:

    const handleInterestsBoxClick = () => {
        setActiveInterest(!activeInterestButton);
        if(activeInterestButton==false){
            setShowDetailButton(false)
        }else{
            setShowDetailButton(true)
        }
        setActiveData(false);
        setActiveEmbedding(false);
        setActiveSimilarity(false);
      };
      const handleDataBoxClick = () => {
        setActiveData(!activeDataButton);
        if(activeDataButton==false){
            setShowDetailButton(false)
        }else{
            setShowDetailButton(true)
        }
        setActiveInterest(false);
        setActiveEmbedding(false);
        setActiveSimilarity(false);
      };
      const handleEmbeddingsBoxClick = () => {
        setActiveEmbedding(!activeEmbeddingButton);
        if(activeEmbeddingButton==false){
            setShowDetailButton(false)
        }else{
            setShowDetailButton(true)
        }
        setActiveInterest(false);
        setActiveData(false);
        setActiveSimilarity(false);
      };
      const handleSimilarityBoxClick = () => {
        setActiveSimilarity(!activeSimilarityButton);
        if(activeSimilarityButton==false){
            setShowDetailButton(false)
        }else{
            setShowDetailButton(true)
        }
        setActiveInterest(false);
        setActiveData(false);
        setActiveEmbedding(false);
      };

    // data
    var moreDetailFlowchart = [
        // nodes
        {
          data: {
            id: "one",
            label: "Interest Model",
            faveColor: "#80b3ff",
            shape: "round-rectangle",
            width: 150,
          },
          position: { x: 303, y: 30 },
        },
        {
          data: {
            id: "two",
            label: "Semantic Scholar API",
            faveColor: "#80b3ff",
            shape: "round-rectangle",
            width: 150,
          },
          position: { x: 515, y: 30 },
        },
        {
          data: {
            id: "three",
            label: "Interests",
            faveColor: "#3385ff",
            shape: "diamond",
            width: 110,
          },
          position: { x: 150, y: 110 },
        },
        {
          data: {
            id: "four",
            label: "Split Keyphrase into Keywords",
            faveColor: "#3385ff",
            shape: "rectangle",
            width: 200,
          },
          position: { x: 410, y: 110 },
        },
        {
          data: {
            id: "five",
            label: "Keywords",
            faveColor: "#3385ff",
            shape: "diamond",
            width: 110,
          },
          position: { x: 680, y: 110 },
        },
        {
          data: {
            id: "six",
            label: "Word Embedding",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 120,
          },
          position: { x: 100, y: 190 },
        },
        {
          data: {
            id: "seven",
            label: "Word Embedding",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 120,
          },
          position: { x: 330, y: 190 },
        },
        {
          data: {
            id: "eight",
            label: "Word Embedding",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 120,
          },
          position: { x: 490, y: 190 },
        },
        {
          data: {
            id: "nine",
            label: "Word Embedding",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 120,
          },
          position: { x: 750, y: 190 },
        },
        {
          data: {
            id: "ten",
            label: "Interest Embeddings",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 130,
          },
          position: { x: 150, y: 260 },
        },
        {
          data: {
            id: "eleven",
            label: "Publication Keyword Embeddings",
            faveColor: "#0052cc",
            shape: "rectangle",
            width: 210,
          },
          position: { x: 700, y: 260 },
        },
        {
          data: {
            id: "twelve",
            label: "Cosine Similarity",
            faveColor: "#002966",
            shape: "round-rectangle",
            width: 120,
          },
          position: { x: 410, y: 350 },
        },
        // edges
        { data: { source: "one", target: "three", label: "Weighted Interests" } },
        { data: { source: "two", target: "five", label: "Weighted Interests" } },
        { data: { source: "three", target: "four", label: "No" } },
        { data: { source: "three", target: "six", label: "Yes" } },
        { data: { source: "five", target: "four", label: "No" } },
        { data: { source: "five", target: "nine", label: "Yes" } },
        { data: { source: "four", target: "seven", label: "Keyword" } },
        { data: { source: "four", target: "eight", label: "Keyword" } },
        { data: { source: "six", target: "ten", label: "Interest Embedding" } },
        { data: { source: "seven", target: "ten", label: "Interest Embeddings" } },
        {
          data: { source: "eight", target: "eleven", label: "Keyword Embeddings" },
        },
        { data: { source: "nine", target: "eleven", label: "Keyword Embedding" } },
        {
          data: {
            source: "ten",
            target: "twelve",
            label: "Weighted avg of all Interest Embeddings",
          },
        },
        {
          data: {
            source: "eleven",
            target: "twelve",
            label: "Weighted avg of all publication Keyword Embeddings",
          },
        },
      ];
    var lessDetailFlowchart = [
    // nodes
    {
        data: {
        id: "one",
        label: "Interest Model",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
        },
        position: { x: 110, y: 50 },
    },
    {
        data: {
        id: "two",
        label: "Semantic Scholar API",
        faveColor: "#80b3ff",
        shape: "round-rectangle",
        width: 150,
        },
        position: { x: 310, y: 50 },
    },
    {
        data: {
        id: "three",
        label: "Interests",
        faveColor: "#3385ff",
        shape: "rectangle",
        width: 150,
        },
        position: { x: 110, y: 150 },
    },
    {
        data: {
        id: "four",
        label: "Keywords",
        faveColor: "#3385ff",
        shape: "rectangle",
        width: 150,
        },
        position: { x: 310, y: 150 },
    },
    {
        data: {
        id: "five",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "rectangle",
        width: 150,
        },
        position: { x: 110, y: 250 },
    },
    {
        data: {
        id: "six",
        label: "Word2Vec",
        faveColor: "#0052cc",
        shape: "rectangle",
        width: 150,
        },
        position: { x: 310, y: 250 },
    },
    {
        data: {
        id: "seven",
        label: "Cosine Similarity",
        faveColor: "#002966",
        shape: "round-rectangle",
        width: 150,
        },
        position: { x: 210, y: 350 },
    },
    // edges
    { data: { source: "one", target: "three", label: "" } },
    { data: { source: "two", target: "four", label: "" } },
    { data: { source: "three", target: "five", label: "" } },
    { data: { source: "four", target: "six", label: "" } },
    { data: { source: "six", target: "seven", label: "" } },
    { data: { source: "five", target: "seven", label: "" } },
    ];
    var sampleData = [
      // nodes
      {
          data: {
          id: "one",
          label: "Node1",
          faveColor: "#80b3ff",
          shape: "round-rectangle",
          width: 150,
          },
          position: { x: 110, y: 50 },
      },
      {
          data: {
          id: "two",
          label: "Node1",
          faveColor: "#80b3ff",
          shape: "round-rectangle",
          width: 150,
          },
          position: { x: 310, y: 50 },
      },
      // edges
      { data: { source: "one", target: "two", label: "" } },
      ];
  

    // Additional Components
    const moreDetailFlowchartBox = <Flowchart elements={moreDetailFlowchart} height={400} />;
    const lessDetailFlowchartBox = <Flowchart elements={lessDetailFlowchart} height={400} />;
    const interestsKeywordsBox = <Grid container md={12}
    style={{
        borderBottom: "1px solid #2d3985",
        borderColor: "#2d3985",
        alignContent: "center",
        margin: "0px 10px",
    }}>
    
        <Grid item md={6} >
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Interests
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Weights
                            </Typography>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {/* {state.interests.map((interest) => (
                        <TableRow key={interest._id}>
                            <TableCell component="th" scope="row">
                                <Typography variant="subtitle2" align="center">
                                    {interest.text}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" align="center">
                                    {interest.weight}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item md={6} >
        <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                    <TableRow>
                    <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Keywords
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Weights
                            </Typography>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {/* {Object.keys(state.paper.paper_keywords).map((keyword, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">
                                <Typography variant="subtitle2" align="center">
                                    {keyword}
                                </Typography>
                            </TableCell>
                            <TableCell align="right"> 
                                <Typography variant="subtitle2" align="center">
                                    {state.paper.paper_keywords[keyword]}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

    </Grid>;
    const DataPreProcessBox = <Grid container md={12}
    style={{
        borderBottom: "1px solid #2d3985",
        borderColor: "#2d3985",
        alignContent: "center",
        margin: "0px 10px",
    }}>
    
        <Grid item md={6} >
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Interests
                            </Typography>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                            Split keyphrase into keywords 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Flowchart elements={sampleData} height={320}/>
        </Grid>
        <Grid item md={6} >
        <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>
                            <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                Publication
                            </Typography>
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                            Split keyphrase into keywords 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Flowchart elements={sampleData} height={320} />
        </Grid>
    </Grid>
    const embeddingBox = <Grid container md={12}
        style={{
          borderBottom: "1px solid #2d3985",
          borderColor: "#2d3985",
          alignContent: "center",
          margin: "0px 10px",
      }}>
      
          <Grid item md={6} >
              <TableContainer >
                  <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.head}>
                      <TableRow>
                          <TableCell>
                              <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                  Interests
                              </Typography>
                          </TableCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow>
                              <TableCell component="th" scope="row">
                              Weighted average of all interest embeddings 
                              </TableCell>

                          </TableRow>
                      </TableBody>
                  </Table>
              </TableContainer>
              <Flowchart elements={sampleData} height={320}/>
          </Grid>
          <Grid item md={6} >
          <TableContainer >
                  <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.head}>
                          <TableRow>
                              <TableCell>
                                  <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                      Publication
                                  </Typography>
                              </TableCell>                            
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow>
                              <TableCell component="th" scope="row">
                              Weighted average of all keyword embeddings
                              </TableCell>
                          </TableRow>
                      </TableBody>
                  </Table>
              </TableContainer>
              <Flowchart elements={sampleData} height={320}/>
          </Grid>
      </Grid>;
    const similarityBox = <>
    <Grid container md={12}
    style={{
        borderBottom: "1px solid #2d3985",
        borderColor: "#2d3985",
        alignContent: "center",
        margin: "0px 10px",
    }}>
    
        <Grid item md={6} >
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                    Interests
                                </Typography>
                            </TableCell>                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                            Interest Model Embeddings                                    
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        <Grid item md={6} >
            <TableContainer >
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.head}>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" align="center" style={{color:"white"}}>
                                    Publication
                                </Typography>
                            </TableCell>                                
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Publication Embeddings 
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
    <Grid container md={12}
    style={{
        borderBottom: "1px solid #2d3985",
        borderColor: "#2d3985",
        alignContent: "center",
        margin: "0px 10px",
    }}>
        <Flowchart elements={sampleData} height={320}/>
    </Grid></>;

      // end Tannaz
        return (
            // start Tannaz
            <>
              <Grid item md={12} className={classes.collapseButton}>
              {showDetailButton && !moreDetail &&
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
                }
                {showDetailButton && moreDetail &&
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
               }

                {!showDetailButton &&
                <ButtonMUI
                  variant="string"
                  size="small"
                  className="m-2 mr-4"
                >
                  <ZoomOutMapIcon color="action" fontSize="small" />
                  <Typography
                    align="center"
                    variant="subtitle2"
                    className="ml-1"
                  >
                    Button
                  </Typography>
                </ButtonMUI>
                }
            </Grid>
            {/* Left Category Buttons */}
            <Grid item md={2} sm={12} style={{marginRight:"0",paddingRight:"0"}}>
              <Grid className="table-responsive-sm" style={{marginRight:"0",paddingRight:"0"}}>
                <table className="table">
                  <tbody>
                    <tr className="box">
                      <td className={activeInterestButton ? "active box-item interestsBox " : "deactive box-item interestsBox "} onClick={() => {handleInterestsBoxClick();}}>
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
                        <td className={activeDataButton ? "active box-item dataBox " : "deactive box-item dataBox "} onClick={() => {handleDataBoxClick();}}>
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
                    <td className={activeEmbeddingButton ? "active box-item embeddingsBox " : "deactive box-item embeddingsBox "} onClick={() => {handleEmbeddingsBoxClick();}}>
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
                    <td className={activeSimilarityButton ? "active box-item similarityBox " : "deactive box-item similarityBox "} onClick={() => {handleSimilarityBoxClick();}}>
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
            </Grid>
            {/* Right howBox */}
            <Grid item md={10} sm={12} style={{paddingLeft:"20px",paddingRight:"20px"}}>

              {
                !activeInterestButton && !activeDataButton && !activeEmbeddingButton && !activeSimilarityButton && moreDetail && moreDetailFlowchartBox
              }
                            {
                !activeInterestButton && !activeDataButton && !activeEmbeddingButton && !activeSimilarityButton && !moreDetail && lessDetailFlowchartBox
              }
              {
                activeInterestButton && interestsKeywordsBox
              }

              {
                activeDataButton && DataPreProcessBox
              }

              {
                activeEmbeddingButton && embeddingBox
              }

              {
                activeSimilarityButton && similarityBox
              }
            </Grid>
            </>
            // end Tannaz

        )
    }



