import React, {useEffect, useState} from "react"
import RestAPI from "../../../../../Services/api";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@material-ui/core";
import cxtmenu from "cytoscape-cxtmenu";
import {toast, ToastContainer} from "react-toastify";
import WikiDesc from "../Connect/WikiDesc";
import "react-toastify/dist/ReactToastify.css";

cytoscape.use(cxtmenu);

function getColor(currColors) {
    const allColors = [
        "#397367",
        "#160C28",
        "#EFCB68",
        "#C89FA3",
        "#368F8B",
        "#232E21",
        "#B6CB9E",
        "#92B4A7",
        "#8C8A93",
        "#8C2155",
        "#22577A",
        "#7FD8BE",
        "#875C74",
        "#9E7682",
        "#FCAB64",
        "#EDCB96",
        "#231942",
        "#98B9F2"
    ];
    let pickedColor = "";
    if (allColors.length === currColors.length) {
        currColors = [];
        pickedColor = allColors[0];
    } else {
        let index = currColors.length;
        pickedColor = allColors[index];
        currColors.push(pickedColor);
    }

    return [pickedColor, currColors];
}

function getElements(dataOrg) {
    let ids = [...Array(200).keys()];
    if(dataOrg){
        const data=dataOrg[0]
        let elements = [
            {data: {id: -1, label: data.title, level: 0, color: "black"}}
        ];
        let currColors = [];
        data["relatedTopics"].map((d) => {
            let colors = getColor(currColors);
            currColors = colors[1];
            let label = d.title;
            let explore = d.relatedTopics;
            let idLevel1 = ids.pop();
            let color = colors[0];
            let element = {
                data: {
                    id: idLevel1,
                    label: label,
                    level: 1,
                    color: color,
                    pageData: d.summary,
                    url: d.url
                },
                classes: ["level1"]
            };
            let edge = {
                data: {source: -1, target: idLevel1, color: color},
                classes: ["level1"]
            };
            elements.push(element, edge);

            explore.map((e) => {
                label = e.title;
                //idLevel2=idTarget+1
                let idLevel2 = ids.pop();
                element = {
                    data: {
                        id: idLevel2,
                        label: label,
                        level: 2,
                        color: color,
                        pageData: e.summary,
                        url: e.wikiURL
                    },
                    classes: ["level2", "collapsed"]
                };
                edge = {
                    data: {target: idLevel2, source: idLevel1, color: color},
                    classes: ["level2", "collapsed"]
                };

                elements.push(element, edge);

              /* let relatedTopics = e.relatedTopics;

                relatedTopics.map((r) => {
                    let idLevel3 = ids.pop();
                    label = r.title;
                    element = {
                        data: {
                            id: idLevel3,
                            label: label,
                            level: 3,
                            color: color,
                            pageData: r.summary,
                            url: r.wikiURL
                        },
                        classes: ["collapsed", "level3"]
                    };
                    edge = {
                        data: {target: idLevel3, source: idLevel2, color: color},
                        classes: ["collapsed", "level3"]
                    };
                    elements.push(element, edge);
                });*/
            });
        });
        return elements;
    }

    return []

}

const SimiliarInterests = (props)=>{
    const {interest}=props
    const [data, setData]=useState()
    const [openDialog, setOpenDialog] = useState({
        openLearn: null,
        openAdd: null
    });

    const validateInterest = (interests, interest) => {
        return interests.some((i) => i.text === interest.toLowerCase());
    };

    const addNewInterest = async (currInterest) => {
       /* let alreadyExist = validateInterest(keywords, currInterest);

        if (!alreadyExist) {
            let newInterests = keywords;
            let newInterest = {
                id: Date.now(),
                categories: [],
                originalKeywords: [],
                source: "Manual",
                text: currInterest.toLowerCase(),
                value: 3,
            }
            newInterests.push(newInterest);

            newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
            let listOfInterests = [];
            newInterests.forEach(interest => {
                let item = {
                    name: interest.text,
                    weight: interest.value,
                    id: interest.id
                }
                listOfInterests.push(item);
            });
            console.log("Updated list", listOfInterests)
            try {
                await RestAPI.addKeyword(listOfInterests);
            } catch (err) {
                console.log(err);
            }
            // console.log(newInterests)
        }
        console.log("Interest already exists in my list!")*/
    }

    const handleOpenLearn = (ele) => {
        const data = ele.data();
        setOpenDialog({ ...openDialog, openLearn: true, nodeObj: data });
    };
    const handleCloseLearn = () => {
        setOpenDialog({ ...openDialog, openLearn: false });
    };

    const [elements, setElements] = useState([]);

    const getData=async ()=>{


            const response = await RestAPI.getExploreData(interest)
            const {data}=response
            setData(data.data)
            console.log("test data",data)


    }
    useEffect(() => {
        getData()
    }, []);
    useEffect(() => {
        const elementsCurr = getElements(data);

        setElements([]);
        setElements(elementsCurr);
    }, [data]);

    const layoutGraph = {
        name: "concentric",
        concentric: function (node) {
            return 10 - node.data("level");
        },
        levelWidth: function () {
            return 1;
        }
    };
    const stylesheet = [
        {
            selector: "node",
            style: {
                width: 200,
                height: 200,
                label: "data(label)",
                "background-color": "data(color)",
                color: "white"
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "straight"
            }
        },
        {
            selector: "node[label]",
            style: {
                "text-halign": "center",
                "text-valign": "center",
                "text-wrap": "wrap",
                "text-max-width": 20,
                "font-size": 24
            }
        },
        {
            selector: ".collapsed",
            style: {
                display: "none"
            }
        },
        {
            selector: ".level1",
            style: {
                "line-color": "data(color)",
                color: "white"
            }
        },
        {
            selector: ".level2",
            style: {
                "background-opacity": 0.6,
                "line-color": "data(color)"
            }
        },
        {
            selector: ".level3",
            style: {
                "background-opacity": 0.4,
                "line-color": "data(color)"
            }
        }
    ];

    return (<>
        {data?<CytoscapeComponent
            style={{width: "100%", height: "350px", backgroundColor: "#F8F4F2"}}
            layout={layoutGraph}
            stylesheet={stylesheet}
            elements={elements}
            cy={(cy) => {
                cy.elements().remove();
                cy.add(elements);
                cy.layout(layoutGraph);
                cy.layout(layoutGraph).run();

                cy.fit();

                let defaultsLevel2 = {
                    selector: "node[level=2]",
                    menuRadius: 75, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
                    //selector: "node", // elements matching this Cytoscape.js selector will trigger cxtmenus
                    commands: [
                        // an array of commands to list in the menu or a function that returns the array

                        {
                            content: "Learn more",
                            // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                // a function to execute when the command is selected

                                handleOpenLearn(ele); // `ele` holds the reference to the active element
                            },
                            enabled: true // whether the command is selectable
                        },
                        {
                            content: "Expand", // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                let succ = ele.successors().targets();
                                let edges = ele.successors();
                                let ids = [];
                                edges.map((e) => {
                                    e.removeClass("collapsed");
                                    ids.push(
                                        e.data()["target"],
                                        e.data()["source"],
                                        e.data()["id"]
                                    );
                                    console.log(ids, "test");
                                });

                                /*succ.map((s) => {
                                  s.removeClass("collapsed");
                                });*/
                                cy.fit([ele, succ, edges], 16);
                            },
                            enabled: false

                            // whether the command is selectable
                        },
                        {
                            content: "Add to my interests", // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                // a function to execute when the command is selected
                                let currInterest = ele.data()["label"];
                                addNewInterest(currInterest)

                                let msg =
                                    "The interest " +
                                    currInterest +
                                    " has added to your interests";
                                toast.success(msg, {
                                    toastId: "addLevel2"
                                }); // `ele` holds the reference to the active element
                            },
                            enabled: true // whether the command is selectable
                        }
                    ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
                    fillColor: "black", // the background colour of the menu
                    activeFillColor: "grey", // the colour used to indicate the selected command
                    activePadding: 8, // additional size in pixels for the active command
                    indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                    separatorWidth: 3, // the empty spacing in pixels between successive commands
                    spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                    adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                    //minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                    //maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                    openMenuEvents: "tap", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                    itemColor: "white", // the colour of text in the command's content
                    itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                    zIndex: 9999, // the z-index of the ui div
                    atMouse: false, // draw menu at mouse position
                    outsideMenuCancel: 8 // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
                };

                let defaultsLevel1 = {
                    selector: "node[level=1]",
                    menuRadius: 75, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
                    //selector: "node", // elements matching this Cytoscape.js selector will trigger cxtmenus
                    commands: [
                        // an array of commands to list in the menu or a function that returns the array

                        {
                            // example command
                            // optional: custom background color for item
                            content: "Learn more", // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                // a function to execute when the command is selected
                                handleOpenLearn(ele); // `ele` holds the reference to the active element
                            },
                            enabled: true // whether the command is selectable
                        },
                        {
                            // example command
                            // optional: custom background color for item
                            content: "Expand", // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                let succ = ele.successors().targets();
                                let edges = ele.successors();
                                let ids = [];
                                edges.map((e) => {
                                    e.removeClass("collapsed");
                                    ids.push(
                                        e.data()["target"],
                                        e.data()["source"],
                                        e.data()["id"]
                                    );
                                    console.log(ids, "test");
                                });

                                /*succ.map((s) => {
                                  s.removeClass("collapsed");
                                });*/
                                cy.fit([ele, succ, edges], 16);
                            },
                            enabled: true

                            // whether the command is selectable
                        },
                        {
                            // example command
                            // optional: custom background color for item
                            content: "Add to my interests", // html/text content to be displayed in the menu
                            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                            select: function (ele) {
                                let currInterest = ele.data()["label"];

                                let msg = "The interest " + currInterest + " has been saved";
                                toast.success(msg, {
                                    toastId: "addLevel1"
                                });
                            },
                            enabled: true // whether the command is selectable
                        }
                    ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
                    fillColor: "black", // the background colour of the menu
                    activeFillColor: "grey", // the colour used to indicate the selected command
                    activePadding: 8, // additional size in pixels for the active command
                    indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size,
                    separatorWidth: 3, // the empty spacing in pixels between successive commands
                    spotlightPadding: 8, // extra spacing in pixels between the element and the spotlight
                    adaptativeNodeSpotlightRadius: true, // specify whether the spotlight radius should adapt to the node size
                    //minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                    //maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
                    openMenuEvents: "tap taphold", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                    itemColor: "white", // the colour of text in the command's content
                    itemTextShadowColor: "transparent", // the text shadow colour of the command's content
                    zIndex: 9999, // the z-index of the ui div
                    atMouse: false, // draw menu at mouse position
                    outsideMenuCancel: 8 // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
                };


                let menu2 = cy.cxtmenu(defaultsLevel2);
                let menu1 = cy.cxtmenu(defaultsLevel1);
             

                /*
              cy.on("tap", "node", function (evt) {
                let node = evt.target;
                let succ = node.successors().targets();
               succ.map((s)=>{
                  s.removeClass("collapsed")
               })

              })*/
            }}/>:<Loading/>}
        <Dialog open={openDialog.openLearn} onClose={handleCloseLearn}>
            {openDialog.nodeObj != null ? (
                <DialogTitle>Learn More about {openDialog.nodeObj.label}</DialogTitle>
            ) : (
                <DialogTitle>Learn more</DialogTitle>
            )}
            <DialogContent>
                {" "}
                <WikiDesc data={openDialog.nodeObj} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseLearn}>Close</Button>
            </DialogActions>
        </Dialog>
        <ToastContainer />
    </> )
}

export default SimiliarInterests

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