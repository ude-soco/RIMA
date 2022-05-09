import React, { useEffect, useRef, createRef, useState } from "react";
import { toast } from "react-toastify";

import {
  Grid, Paper, Typography, Button,
  Box, Modal,
  DialogTitle, DialogContent, DialogActions,
  IconButton, CircularProgress
} from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';

import Seperator from './Components/Seperator';
import { WhatIfGeneral } from './Components/WhatIfGeneral.jsx';
import { handleServerErrors } from "Services/utils/errorHandler";
import InterestsTags from "./TagSearch.js";
import PaperCard from "./PaperCard.js";
import RestAPI from "Services/api";
import ScrollTopWrapper from "../../ReuseableComponents/ScrollTopWrapper/ScrollTopWrapper";



export default function PublicationRecommendation() {

  const [state, setState] = useState({
    papersLoaded: false,
    interests: [],
    papers: [],
    loading: true,
    reloadPapers: true,
    modal: false,
    threshold: 40,

  })

  useEffect(() => {
    getInterests()
  }, [])

  useEffect(() => {
    getRecommendedPapers()
  }, [state.interests])

  const handleApplyGeneralChanges = (newInterests) => {
    closeWhatIfModal()
    setState({
      ...state,
      interests: newInterests,
      loading: true,
      modal: false,
    })
  }
  const handleApplyWhatIfChanges = (index, newPaperProps, ref) => {
    setState({
      ...state,
      loading: true,
    })
    const newPaperList = state.papers.filter(function (obj) {
      return obj.paperId !== index;
    });
    if (newPaperProps.score > newPaperProps.threshold) {
      newPaperList.push(newPaperProps)

      newPaperList.sort((a, b) => {
        return b.score - a.score;
      });
    }
    const timer = setTimeout(() => {
      setState({
        ...state,
        papers: newPaperList,
        loading: false
      })
    }, 2000);

  }

  //What if modal - Jaleh:
  const openWhatIfModal = () => {
    setState({
      ...state,
      modal: true,
    });
  };
  const closeWhatIfModal = (id) => {
    setState({
      ...state,
      modal: false,
    });
  };

  //Hoda 
  const generateRandomRGB = (indexcolor) => {
    var hexValues = [
      "9B59B6",
      "3498DB",
      "48C9B0",
      "F5B041",
      "F05CBA",
      "EE5177",
      "51EED4",
      "EDA043",
      "c39797",
      "7a9097"
    ];

    return "#" + hexValues[indexcolor];
  }
  /**
   * Get Interest to show on the top of the page
   */
  const getInterests = () => {
    return RestAPI.cloudChart().then((response, err) => {
      let rowArray = [];
      if (response.data) {
        //Top 5
        for (let i = 0; i < 5; i++) {
          rowArray.push({
            text: response.data[i].keyword,
            weight: response.data[i].weight,
            id: i.toString(),
            color: generateRandomRGB(i),
          });
        }
      }
      setState({
        ...state,
        isLoding: true,
        interests: rowArray,
      });

    })
      .catch((error) => {
        setState({ ...state, isLoding: false });
        handleServerErrors(error, toast.error);
      });
  };
  /**
   * Get Recommended Items
   */
  function getRecommendedPapers() {
    const { interests } = state;
    if (interests.length > 0) {
      RestAPI.extractPapersFromTags(interests)
        .then((res) => {
          setState(() => ({
            ...state,
            loading: false,
            papers: res.data.data,
            papersLoaded: true,
          }));
        })
        .catch((err) => console.error("Error Getting Papers:", err));
    }
  };

  const refinePapers = (papers) => {
    let res = []
    papers.map((paper) => {
      res.push({
        paperId: paper.paperId,
        title: paper.title,
        interests_similarity: paper.interests_similarity,
        paper_keywords: paper.paper_keywords,
        score: paper.score
      })
    })
    return res
  }
  const refineInterests = (interests) => {
    let res = []
    interests.map((interest) => {
      res.push({
        id: interest.id,
        text: interest.text,
        color: generateRandomRGB(interest.id),
        weight: interest.weight,
      })
    })
    return res
  }
  const { papers } = state;
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '1px solid #ccc',
    overflow: 'scroll',
    height: '100%',
    display: 'block',
    // boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <Grid container component={Paper} className="bg-gradient-default1 shadow">
        <Grid item md={12} style={{ padding: '15px' }} className="bg-transparent">
          <Typography variant="h6">Publications Recommendation</Typography>
          {/* start Tannaz */}
          <Grid container spacing={2} className="d-flex align-items-center mt-3">
            <Grid item md={11}>
              <fieldset className="paper-interests-box">
                <legend
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Your interests:
                </legend>
                <Grid container className="align-items-center">
                  <Grid item md={12}>
                    <InterestsTags
                      tags={refineInterests(state.interests)}
                    />
                  </Grid>

                </Grid>
              </fieldset>
            </Grid>
            <Grid item md={1}>
              <Grid id="WhatifButton" onClick={() => openWhatIfModal()}>
                <Typography align="center" variant="caption" size="large">
                  What-if?
                </Typography >
              </Grid>
              <Modal open={state.modal} onClose={closeWhatIfModal} size="md">
                <Paper style={style}>
                  <Grid item md={12}>
                    <DialogTitle style={{ m: 0, p: 2 }} >
                      <Seperator Label="What if?" Width="130" />
                      {state.modal ? (
                        <IconButton
                          aria-label="close"
                          onClick={closeWhatIfModal}
                          style={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                    </DialogTitle>
                  </Grid>
                  <Grid item md={12}>
                    <DialogContent>
                      <WhatIfGeneral interests={refineInterests(state.interests)} threshold={state.threshold} items={refinePapers(papers)} handleApplyGeneralChanges={handleApplyGeneralChanges} />
                    </DialogContent>
                  </Grid>
                </Paper>
              </Modal>
            </Grid>
          </Grid>
        </Grid>
        {/* <div className="d-flex align-items-center ml-4 mt-2">
              <Button variant="string">
                <CloudQueueIcon color="action" fontSize="small" />
                <Typography align="center" variant="subtitle2" className="ml-2">
                  Interests Sources
                </Typography >
              </Button>
            </div> */}
        <Seperator Label="Publications" Width="130" />
        {/* end Tannaz */}
        <Grid container style={{ padding: "20px" }} id="paper-card-container">
          {state.loading ? (
            <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center">
              <Grid item md={3}>
                <CircularProgress />
              </Grid>
              <Grid item md={3}>
                <Typography align="center" variant="subtitle2" className="ml-2">Loading Publications.. please wait</Typography>
              </Grid>
            </Grid>
          ) : (
            papers ? (papers.map((paper, i) => {
              if (paper.score > state.threshold) {
                return (
                  <PaperCard
                    key={paper.paperId}
                    index={paper.paperId}
                    paper={paper}
                    interests={refineInterests(state.interests)}
                    threshold={state.threshold}
                    handleApplyWhatIfChanges={handleApplyWhatIfChanges}
                  />
                );
              }
            })) : (
              <Typography align="center" variant="subtitle2" className="ml-2">No publication Found</Typography>
            ))}
        </Grid>
      </Grid>
      <ScrollTopWrapper />
    </>
  );
}