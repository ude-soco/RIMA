import "./styles.css";
import React from "react"
import {
    Box,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    DialogContent, Grid, CircularProgress
} from "@material-ui/core";

import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import nodeHtmlLabel from "cytoscape-node-html-label";
import cxtmenu from "cytoscape-cxtmenu";
//import data from "./dataConnect";
import { useEffect, useState } from "react";

import SVGVenn from "./SVGVenn";

import WhyInterest from "../WhyInterest/WhyInterest";
import RestAPI from "../../../../../Services/api";
import FilterListIcon from "@material-ui/icons/FilterList";
import Contact from "./Contact";




cytoscape.use(nodeHtmlLabel);
cytoscape.use(cxtmenu);

function getGraphData(data) {
    let ids = [...Array(20).keys()];

    console.log(data, "data getGraph")
    let citations = data.citations
    let references = data.references

    console.log(citations, references, "data get Graph cit, ref")
    let y1 = 100;
    let y2 = 100;
    const label1 = "Authors who cited you the most";
    const label2 = "Authors most cited by you";
    const elements = [
        {
            data: { id: -1, label: "You" },
            classes: ["user", "multiline"],
            position: { x: 300, y: 175 }
        },
        {
            data: { id: -2, label: label2 },
            classes: ["multiline", "header"],
            position: { x: 100, y: 50 }
        },
        {
            data: { id: -3, label: label1 },
            classes: ["multiline", "header"],
            position: { x: 500, y: 50 }
        }
    ];
    citations.map((a) => {
        let id = ids.pop();
        console.log(a.paper);
        let element = {
            data: {
                id: id,
                authorId: a.id,
                name: a.name,
                score: a.score,
                interests: a.interests,
                paper: a.paper,
                level:2
            },
            classes: ["multiline", "author", "citeMe"],
            position: { x: 550, y: y1 }
        };
        let edge = {
            data: { target: id, source: -1 },
            classes: ["edge"]
        };
        elements.push(element, edge);
        y1 = y1 + 75;
    });

    references.map((b) => {
        let id = ids.pop();
        let element = {
            data: {
                id: id,
                authorId: b.id,
                name: b.name,
                score: b.score,
                interests: b.interests,
                paper: b.paper,
                level:1
            },
            classes: ["multiline", "author", "citedByMe"],
            position: { x: 50, y: y2 }
        };
        let edge = {
            data: { target: -1, source: id },
            classes: ["edge"]
        };
        elements.push(element, edge);
        y2 = y2 + 75;
    });

    console.log(elements);
    return elements;
}



const ConnectedGraph = (props) => {
    const {data, myInterests}=props

     

    const [dialog, setDialog] = useState({
        openCompareInterest: false,
        openIamCited: false,
        openIhaveCited: false,
        currNode: { name: "" },
        myInterests:myInterests,
        compareInterests: null,
        userName: "You",
        openContact:false,
    });
    const [elements, setElements] = useState([]);
    const [paper, setPaper] = useState([]);
    const [authorId, setAuthorId] = useState("");
    
    const years = paper.map(pap => pap.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const [yearRange, setYearRange] = useState([1990,2023]);
    const filteredPapers = paper.filter(pap => pap.year >= yearRange[0] && pap.year <= yearRange[1]);
    
    
    
    


    const handleMinYearChange = (minYear) => {
        const newMinYear = parseInt(minYear);
        const newMaxYear = yearRange[1];

        if (newMinYear > newMaxYear) {
          setYearRange([newMaxYear, newMinYear]);
        } else {
          setYearRange([newMinYear, newMaxYear]);
        }
      };
      
      const handleMaxYearChange = (maxYear) => {
        const newMaxYear = parseInt(maxYear);
        const newMinYear = yearRange[0];
        
        if (newMinYear > newMaxYear) {
          setYearRange([newMaxYear, newMinYear]);
        } else {
          setYearRange([newMinYear, newMaxYear]);
        }
      };
      



    const getData = async ()=>{

        const currElements = getGraphData(data);
        setElements(currElements);

    }
    useEffect(() => {
        const currElements = getGraphData(data);
        setElements(currElements);
        setDialog({...dialog, myInterests: myInterests})


    }, [myInterests]);

    const handleOpenCompareInterests = (ele) => {
        setDialog({
            ...dialog,
            openCompareInterest: true,
            currNode: ele.data(),
            compareInterests: ele.data()["interests"]
        });
    };

    const handleIhaveCited = (ele) => {
        setPaper(ele.data().paper);

        setDialog({ ...dialog, openIhaveCited: true, currNode: ele.data() });
    };

    const handleIamCited = (ele) => {
        console.log(dialog.currNode, "test");
        setPaper(ele.data().paper);
        setDialog({ ...dialog, openIamCited: true, currNode: ele.data() });
    };

    const handleContact = (ele) => {
        setAuthorId(ele.data().authorId);
        //console.log(ele.data().authorId);
        setDialog({...dialog,  openContact: true});
    };

    const handleClose = () => {
        setDialog({
            ...dialog,
            openCompareInterest: false,
            openIamCited: false,
            openIhaveCited: false,
            openContact:false,
        });
        setYearRange([1990, 2023]);
    };

   /* const testPrint2 = () => {
        console.log(data.id);
    };*/

    const layout = { name: "preset" };
    const stylesheet = [
        {
            selector: "node",
            style: {
                shape: "round-rectangle",
                //label:"data(name)",
                width: "150px",
                height: "50px",
                "text-halign": "center",
                "text-valign": "center",
                "background-color": "rgba(255, 255, 255, 0)",
                "border-width": 2,
                "border-opacity": "0%"
            }
        },
        {
            selector: "edge",
            style: {
                "target-arrow-shape": "triangle",
                "target-arrow-color": "black",
                "source-arrow-color": "black",
                "line-color": "#333",
                width: 1.5,
                "curve-style": "taxi",
                "taxi-direction": "horizontal"
            }
        },
        {
            selector: ".user",
            style: {
                "background-image": "https://i.ibb.co/d2XmXt1/icons8-person-64.png",
                "border-opacity": "0%",
                "background-image-containment": "over",
                height: 200,
                "background-position-y": 20
            }
        }
    ];



    

    return (
        <>
        
            <CytoscapeComponent
                elements={elements}
                style={{ width: "100%", height: "600px" }}
                layout={layout}
                stylesheet={stylesheet}
                cy={(cy) => {
                    cy.fit(elements, 20);
                    cy.autolock(true);

                    
                    const menuCiteMe = {
                        selector: ".citeMe",
                        menuRadius: 50,
                        commands: [
                            {
                                content: "Compare Interests",
                                contentStyle: {},
                                select: function (ele) {
                                    handleOpenCompareInterests(ele);
                                },
                                enabled: true
                            },
                            {
                                content: "Where am I cited?",
                                contentStyle: {},
                                select: function (ele) {
                                    handleIamCited(ele);
                                },
                                enabled: true
                            },
                            {
                                content: "Contact",
                                contentStyle: {},
                                select: function (ele) {
                                    handleContact(ele);
                                },
                                enabled: true
                            },
                             
                        ],
                        fillColor: "black",
                        activeFillColor: "grey",
                        //activePadding: 8, // additional size in pixels for the active command
                        indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                        separatorWidth: 3, // the empty spacing in pixels between successive commands
                        spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                        //adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                        minSpotlightRadius: 20, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        maxSpotlightRadius: 44, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                        itemColor: "white", // the colour of text in the command's content
                        itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                        zIndex: 9999, // the z-index of the ui div
                        atMouse: false, // draw menu at mouse position
                        outsideMenuCancel: 8
                    };

                    const menuCitedByMe = {
                        selector: ".citedByMe",
                        menuRadius: 50,
                        commands: [
                            {
                                content: "Compare Interests",
                                contentStyle: {},
                                select: function (ele) {
                                    handleOpenCompareInterests(ele);
                                },
                                enabled: true
                            },
                            {
                                content: "Where have I cited?",
                                contentStyle: {},
                                select: function (ele) {
                                    handleIhaveCited(ele);
                                },
                                enabled: true
                            },
                            {
                                content: "Contact",
                                contentStyle: {},
                                select: function (ele) {
                                    handleContact(ele);
                                },
                                enabled: true
                            },
                            
                        ],
                        fillColor: "black",
                        activeFillColor: "grey",
                        //activePadding: 8, // additional size in pixels for the active command
                        indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                        separatorWidth: 3, // the empty spacing in pixels between successive commands
                        spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                        //adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                        minSpotlightRadius: 20, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        maxSpotlightRadius: 44, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                        itemColor: "white", // the colour of text in the command's content
                        itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                        zIndex: 9999, // the z-index of the ui div
                        atMouse: false, // draw menu at mouse position
                        outsideMenuCancel: 8
                    };
                    const menuheader = {
                        selector: ".header",
                        menuRadius: 50,
                        commands: [

                        ],
                        fillColor: "white",
                        activeFillColor: "white",
                        //activePadding: 8, // additional size in pixels for the active command
                        indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                        separatorWidth: 3, // the empty spacing in pixels between successive commands
                        spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                        //adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                        minSpotlightRadius: 20, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        maxSpotlightRadius: 44, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                        openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                        itemColor: "white", // the colour of text in the command's content
                        itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                        zIndex: 9999, // the z-index of the ui div
                        atMouse: false, // draw menu at mouse position
                        outsideMenuCancel: 8
                    };

                    let labels = [
                        {
                            query: ".author",
                            cssClass: "author",
                            halign: "center",
                            valign: "center",
                            halignBox: "center",
                            valignBox: "center",

                            tpl(data) {
                                return (
                                    "<span class='nodetest'>" +
                                    data.name +
                                    "<br/>" +
                                    (props.button ? '<b class="score">': '<b class="score2">') +  //So that the Textsize changes.
                                    "<Tooltip title='Number of Citations' placement='right'>" + 
                                    data.score +
                                    "</Tooltip>" +
                                    "</b>" +
                                    "</span>"
                                );
                            }
                        },
                        {
                            query: ".user",
                            cssClass: "user",
                            halign: "center",
                            valign: "center",
                            halignBox: "center",
                            valignBox: "center",

                            tpl(data) {
                                return "<span class='nodetest'>" + data.label + "</span>";
                            }
                        },
                        {
                            query: ".header",
                            cssClass: "header",
                            halign: "center",
                            valign: "center",
                            halignBox: "center",
                            valignBox: "center",

                            tpl(data) {
                                return "<span class='header'>" + data.label + "</span>";
                            }
                        }
                    ]
                    let htmlLabel=cy.nodeHtmlLabel(labels);
                    let menu2 = cy.cxtmenu(!props.button ? menuCitedByMe: "");  //no Menu without proper data
                    let menu1 = cy.cxtmenu(!props.button ? menuCiteMe : "");
                    let menu3 = cy.cxtmenu(menuheader)


                }}
            />


            <Dialog  open={dialog.openContact}  onClose={handleClose} >
                <DialogContent>
                        <Grid container>
                        <Grid item xs>
                            <Contact authorId={authorId}/>
                        </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={dialog.openCompareInterest} onClose={handleClose} maxWidth="md">
                {dialog.currNode != null ? (
                    <DialogTitle>
                        Compare your interests with {dialog.currNode.name}
                    </DialogTitle>
                ) : (
                    <DialogTitle> Compare your interests</DialogTitle>
                )}
                <DialogContent >
                    <Grid container>
                        <Grid item = {"xs"}>
                            <SVGVenn

                                authorInterest={dialog.compareInterests}
                                authorName={dialog.currNode.name}
                                userName={dialog.userName}
                            />
                        </Grid>


                    </Grid>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialog.openIamCited} onClose={handleClose} maxWidth="lg">
                <DialogTitle>Where am I cited?</DialogTitle>

                <DialogContent >
                    <Typography>
                        {" "}
                        Publications by {dialog.currNode.name} which cited you
                    </Typography>
                    <Typography>
                        Number of Papers found : {filteredPapers.length}
                    </Typography>
                   
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <TextField
                            label="MinYear"
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => handleMinYearChange(e.target.value)}
                            defaultValue={minYear.toString()}
                            color="primary"
                            style={{ width: "9%" }}      
                            inputProps={{
                                min: minYear,
                                max: yearRange[1],
                                step: 1,
                            }}  
                            /> 
                        <TextField 
                            label="MaxYear"
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => handleMaxYearChange(e.target.value)}
                            defaultValue={maxYear.toString()}
                            color="primary"
                            style={{ width: "9%" }}      
                            inputProps={{
                                min: yearRange[0],
                                max: maxYear,
                                step: 1,
                            }}  
                            /> 
                    </Box>

                    {dialog.currNode != null ? (
                        <WhyInterest papers={filteredPapers} originalKeywords={[]}/>
                    ) : (
                        <></>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialog.openIhaveCited} maxWidth="lg">
                <DialogTitle>Where have I cited?</DialogTitle>

                <DialogContent >
                    {console.log(dialog.currNode.name)}
                    <Typography>
                        {" "}
                        My publications where I have cited {dialog.currNode.name}
                    </Typography>
                    <Typography>
                        Number of Papers found : {filteredPapers.length}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                            <TextField
                            type="number"
                            label="MinYear"
                            variant="outlined"
                            size="small"
                            onChange={(e) => handleMinYearChange(e.target.value)}
                            defaultValue={minYear.toString()}
                            color="primary"
                            style={{ width: "9%" }}      
                            inputProps={{
                                min: minYear,
                                max: yearRange[1],
                                step: 1,
                            }}  
                            /> 
                            <TextField
                            label="MaxYear"
                            type="number"
                            variant="outlined"
                            size="small"
                            onChange={(e) => handleMaxYearChange(e.target.value)}
                            defaultValue={maxYear.toString()}
                            color="primary"
                            style={{ width: "9%" }}      
                            inputProps={{
                                min: yearRange[0],
                                max: maxYear,
                                step: 1,
                            }}  
                            /> 
                        </Box>

                    {dialog.currNode != null ? (
                        <WhyInterest papers={filteredPapers} originalKeywords={[]}/>
                    ) : (
                        <></>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
};

export default ConnectedGraph;
export const Loading = () => {
    return (
        <>
            <Grid
                container
                direction="column"
                justifyContent="center"
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
    )
}