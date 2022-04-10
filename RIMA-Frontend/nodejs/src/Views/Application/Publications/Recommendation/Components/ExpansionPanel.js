import React, { useState } from 'react';

import { Accordion, Card, Button } from "react-bootstrap";
import Seperator from './Seperator';
import { Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Button as ButtonMUI } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';


export default function ExpansionPanel() {
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
                                    ----- Visualizations Why?
                                </div>

                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>
                                        <Seperator Label="How the system works?" Width="200"/>
                                        <div>
                                            ----- Visualizations How?
                                        </div>
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
