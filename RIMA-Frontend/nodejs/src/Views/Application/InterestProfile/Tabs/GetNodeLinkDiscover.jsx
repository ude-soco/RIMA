import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import React, {useEffect, useState} from "react";
import cxtmenu from "cytoscape-cxtmenu";
import WikiDesc from "./WikiDesc";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import RestAPI from "../../../../Services/api";

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

function getNodeData(data, values, interest) {
  let ids = [...Array(200).keys()];
  const elements = [
    {data: {id: -1, label: interest, level: 0, color: "black"}}
  ];
  let currColors = [];

  data.map((d, index) => {
    if (values[index]) {
      let colors = getColor(currColors);

      currColors = colors[1];

      let label = d.topic;
      let pages = d.relatedTopics;
      let idLevel1 = ids.pop();
      let color = colors[0];
      let element = {
        data: {id: idLevel1, label: label, level: 1, color: color},
        classes: ["level1"]
      };
      let edge = {
        data: {source: -1, target: idLevel1, color: color},
        classes: []
      };
      elements.push(element, edge);

      pages.map((p) => {
        let label = p.title;
        let idLevel2 = ids.pop();
        let pageData = p.summary;

        element = {
          data: {
            id: idLevel2,
            label: label,
            level: 2,
            color: color,
            pageData: pageData,
            url: p.url
          },
          classes: ["level2"]
        };
        edge = {
          data: {target: idLevel2, source: idLevel1, color: color},
          classes: []
        };

        elements.push(element, edge);
      });
    }
  });
  return elements;
}

const GetNodeLink = (props) => {
  const {interest, categoriesChecked, data} = props;
  const [openDialog, setOpenDialog] = useState({
    openLearn: null,
    nodeObj: null
  });
  const [keywords, setKeywords] = useState([]);
  let currentUser = JSON.parse(localStorage.getItem("rimaUser"));

  useEffect(() => {
    fetchKeywords().then().catch(err => console.log(err))
  }, []);

  const fetchKeywords = async () => {
    setKeywords([]);
    const response = await RestAPI.longTermInterest(currentUser);
    const {data} = response;
    console.log(data)
    let dataArray = [];
    data.forEach((d) => {
      const {id, categories, original_keywords, original_keywords_with_weights, source, keyword, weight, papers} = d;
      let newData = {
        id: id,
        categories: categories,
        originalKeywords: original_keywords,
        originalKeywordsWithWeights: original_keywords_with_weights,
        source: source,
        text: keyword,
        value: weight,
        papers: papers,
      };
      dataArray.push(newData);
    });
    setKeywords(dataArray);
    return dataArray;
  };

  const validateInterest = (interests, interest) => {
    return interests.some((i) => i.text === interest);
  };

  const addNewInterest = async (currInterest) => {
    let alreadyExist = validateInterest(keywords, currInterest);
    if (!alreadyExist) {
      let newInterests = keywords;
      let newInterest = {
        id: Date.now(),
        categories: [],
        originalKeywords: [],
        source: "Manual",
        text: currInterest,
        value: 3,
      }
      newInterests.push(newInterest);

      newInterests.sort((a, b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));
      setTimeout(() => {
        setKeywords(newInterests);
      }, 500)
      let listOfInterests = [];
      newInterests.forEach(interest => {
        let item = {
          name: interest.text,
          weight: interest.value,
          id: interest.id
        }
        listOfInterests.push(item);
      });
      try {
        await RestAPI.addKeyword(listOfInterests);
      } catch (err) {
        console.log(err);
      }
      console.log(newInterests)
    }
  }

  const elements = getNodeData(data, categoriesChecked, interest);

  const handleOpenLearn = (ele) => {
    const data = ele.data();
    setOpenDialog({...openDialog, openLearn: true, nodeObj: data});
  };

  const handleCloseLearn = () => {
    setOpenDialog({...openDialog, openLearn: false});
  };

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
        "curve-style": "straight",
        "line-color": "data(color)"
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
        color: "white",
        shape: "round-rectangle",
        width: 150,
        height: 150
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

  return (
    <>
      <CytoscapeComponent
        elements={elements}
        style={{width: "100%", height: "800px", backgroundColor: "#F8F4F2"}}
        layout={layoutGraph}
        stylesheet={stylesheet}
        cy={(cy) => {
          cy.elements().remove();
          cy.add(elements);
          //cy.layout(layoutGraph)
          cy.layout(layoutGraph).run();

          cy.fit();
          let defaultsLevel2 = {
            selector: "node[level=2]",
            menuRadius: 75, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
            //selector: "node", // elements matching this Cytoscape.js selector will trigger cxtmenus
            commands: [
              // an array of commands to list in the menu or a function that returns the array

              {
                // example command
                // optional: custom background color for item
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
                // example command
                //fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Remove", // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  let currInterest = ele.data()["label"];
                  let msg =
                    "The interest " + currInterest + " has been removed";
                  toast.error(msg, {
                    toastId: "removedLevel2"
                  });
                  ele.addClass("collapsed");
                },
                enabled: true

                // whether the command is selectable
              },
              {
                // example command
                //fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Add to my interests", // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  // a function to execute when the command is selected
                  let currInterest = ele.data()["label"];
                  addNewInterest(currInterest);
                  let msg = "The interest " + currInterest + " has been saved";
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

          let menu2 = cy.cxtmenu(defaultsLevel2);
        }}
      />
      <Dialog open={openDialog.openLearn} onClose={handleCloseLearn}>
        {openDialog.nodeObj != null ? (
          <DialogTitle>Learn More about {openDialog.nodeObj.label}</DialogTitle>
        ) : (
          <DialogTitle>Learn more</DialogTitle>
        )}
        <DialogContent>
          {" "}
          <WikiDesc data={openDialog.nodeObj}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLearn}>Close</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </>
  );
};

export default GetNodeLink;
