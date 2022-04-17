import React, { useState } from 'react';

import { Accordion, Card, Button } from "react-bootstrap";
import Seperator from './Seperator';
import { Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button as ButtonMUI, Grid, Item } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ReplaceableCloudChart from '../Components/ReplaceableCloudChart';


export default function ExpansionPanel( props ) {

    const [whyShow, setWhyShow] = useState(false);
    const [whatIfShow, setWhatIfShow] = useState(false);

    return (
        <Accordion>
            <Card style={{ boxShadow: "none" , border: "none" }}>
                <Card.Header className="d-flex justify-content-end ">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={() => { setWhyShow(!whyShow); setWhatIfShow(false);}}>
                    Why?
                    </Accordion.Toggle>
                    <div style={{ width:"1px" , height:"40px" , backgroundColor:"#303F9F" , marginRight:"10px"}}/>
                    <Accordion.Toggle as={Button} variant="link" eventKey="2" onClick={() => { setWhatIfShow(!whatIfShow); setWhyShow(false);}}>
                    What-if?
                    </Accordion.Toggle>
                </Card.Header>
                {/* Handling th Back button */}
                {
                    whyShow &&
                    <div className="d-flex justify-content-start " >
                        <Accordion.Toggle as={Button} variant="link" eventKey="1" >
                            <ButtonMUI variant="string"  onClick={() => { setWhyShow(false); }}>
                                <ArrowBackIosNewIcon color="action" fontSize="small" /> 
                                <Typography align="center" variant="subtitle2">
                                    Back 
                                </Typography >
                            </ButtonMUI>
                        </Accordion.Toggle>
                    </div>
                }   
                {
                    whatIfShow &&
                        <div className="d-flex justify-content-start " >
                        <Accordion.Toggle as={Button} variant="link" eventKey="2" >
                            <ButtonMUI variant="string"  onClick={() => { setWhatIfShow(false); }}>
                                <ArrowBackIosNewIcon color="action" fontSize="small" /> 
                                <Typography align="center" variant="subtitle2">
                                    Back 
                                </Typography >
                            </ButtonMUI>
                        </Accordion.Toggle>
                    </div>
                    }  
                {/* Why and How visualizations */}
                <Accordion.Collapse eventKey="1" id="multiCollapseExample2">
                    <Card.Body>
                        <Seperator Label="Why this publication?" Width="170"/>
                        <Accordion>
                            <Card style={{ boxShadow: "none" , border: "none" }}>
                                <Card.Header className="d-flex justify-content-end " style={{ border: "none" }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                    <ButtonMUI variant="string"  onClick={() => { setWhatIfShow(false); }}>
                                        <SettingsIcon color="action" fontSize="small" /> 
                                        <Typography align="center" variant="subtitle2">
                                            How? 
                                        </Typography >
                                    </ButtonMUI>
                                    </Accordion.Toggle>
                                </Card.Header>
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <div style={{width:"90%"}}>
                                                <ReplaceableCloudChart tags={props}/>
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            Barchart
                                        </Grid>
                                    </Grid>
                                </div>

                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>
                                        <Seperator Label="How the system works?" Width="200"/>
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                <div class="table-responsive-sm">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr class="box">
                                                                <td class="box-item interestsBox">
                                                                    <Typography align="left" variant="subtitle2" className="arrowBox">
                                                                        Interests<br />Keywords
                                                                    </Typography >
                                                                </td>
                                                            </tr>
                                                            <tr class="box">
                                                                <td class="box-item dataBox">
                                                                    <Typography align="left" variant="subtitle2" className="arrowBox">
                                                                        Data<br />Preprocess
                                                                    </Typography >
                                                                </td>
                                                            </tr>
                                                            <tr class="box ">
                                                                <td class="box-item embeddingsBox">
                                                                    <Typography align="left" variant="subtitle2" className="arrowBox">
                                                                        Embeddings<br />Generation
                                                                    </Typography >
                                                                </td>
                                                            </tr>
                                                            <tr class="box">
                                                                <td class="box-item similarityBox">
                                                                    <Typography align="left" variant="subtitle2" className="arrowBox">
                                                                        Similarity<br />Calculation
                                                                    </Typography >
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Grid>
                                            <Grid item xs={8}>
                                                SLider
                                            </Grid>
                                        </Grid>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Card.Body>
                </Accordion.Collapse>

                {/* What-if visualization */}
                <Accordion.Collapse eventKey="2">
                    <Card.Body>
                        <Seperator Label="What-if I change?" Width="170"/>
                        <div>
                            ----- Visualizations What-if?
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

    );

  };
