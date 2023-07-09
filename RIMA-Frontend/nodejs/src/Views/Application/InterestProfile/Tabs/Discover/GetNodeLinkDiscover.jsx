import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import React, {useEffect, useState} from "react";
import cxtmenu from "cytoscape-cxtmenu";
import zoom from "cytoscape-cxtmenu";
import WikiDesc from "../Connect/WikiDesc";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import RestAPI from "../../../../../Services/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import swal from 'sweetalert';
import panzoom from "cytoscape-panzoom";
import "cytoscape-panzoom/cytoscape.js-panzoom.css";
import { FaTrash } from "react-icons/fa";
cytoscape.use(cxtmenu);
cytoscape.use(zoom);
cytoscape.use(panzoom);


function getColor(currColors) {
  const allColors = [
    "#397367",
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
  let elements = [
    {data: {id: -1, label: interest, level: 0, color: "#172B4D"}}
  ];
  let currColors = [];
  try{data.map((d, index) => {
    if (values[index]) {
      let colors = getColor(currColors);

      currColors = colors[1];

      let label = d.topic;
      let pages = d.relatedTopics;
      let idLevel1 = ids.pop();
      let color = colors[0];
      // Hauptknoten hinzufügen wie hier
      let mainNode = {
        data: {id: -1, label: label, level: 0, color: ""}
      };
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
  });}
  catch{
    elements = [
      {data: {id: -1, label: "Sorry there is an error.", level: 0, color: "red"}}
    ];
    
  }


  return elements;
}

const GetNodeLink = (props) => {
var cytoscape = require('cytoscape');
var panzoom = require('cytoscape-panzoom');
panzoom( cytoscape ); 
  const {interest, categoriesChecked, data, keywords} = props;
  const [openDialog, setOpenDialog] = useState({
    openLearn: null,
    nodeObj: null
  });

  const panzoomOptions = {
    zoomFactor: 0.1, // Faktor für die Zoomstufe
    zoomDelay: 45, // Verzögerung (in ms) für die Zoomaktion
    minZoom: 0.1, // Minimale Zoomstufe
    maxZoom: 10, // Maximale Zoomstufe
    fitPadding: 50, // Innenabstand für das Einpassen des Graphen
    panSpeed: 15, // Geschwindigkeit des Pannens
    panDistance: 10, // Entfernung, um zu pannen 
    zIndex: 9999, 
  };
  const handleDeleteItem = (item) => {
    // Filtere den Eintrag aus der Liste
    const updatedList = addNewFavourUrl.filter((i) => i.text !== item.text);
    const updatedList2 = addNewFavour.filter((i) => i.text !== item.text);
    
    // Aktualisiere den Zustand oder führe andere erforderliche Aktionen aus
    setAddNewFavourUrl(updatedList);
    setAddNewFavour(updatedList2);
  };
  /*
  const reload = async (interest) => {
    //setState({...state,userInterests: []})
    const response = await RestAPI.getTopicsRelated(interest);
    console.log(response,"xxxx", "1");
    const data = response;
    let dataArray = [];
    data.foreach((d) => {
      //console.log(d, "test")
      //const {title, summary, url, interest, failure} = d;
      const newData = {
        title: d.title,
        summary: d.summary,
        url: d.url,
        interest: d.interest,
        failure: d.failure,
      };
      dataArray.push(newData);
    })
    return dataArray
  };
  */
  /*
  const reloadold = async (interest) => {

    const response = await RestAPI.getTopicsRelated(interest);
    const dataArray = response;
    const nodes = [];
    dataArray.forEach((item) => {
      const node = {
        data: {
          id: "a",
          title: "b",
          summary: "c",
          url: "url",
          failure: "failure"
        }
      };
      nodes.push(node);
    });
    return nodes
  };
  */
  const [addNewFavour, setAddNewFavour] = useState([]); 
  const [addNewFavourUrl, setAddNewFavourUrl] = useState([]);

  const addFavours= async (currFavour) => {
    let currFavourLabel = currFavour.label;
    console.log("xx Discover get node link", currFavourLabel);
    let alreadyExist = validateInterest(addNewFavour, currFavourLabel);
    console.log("xx Discover get node link", alreadyExist);
    if (!alreadyExist) {
      console.log("xx Discover get node link already")
      let newFavour = {
        text: currFavourLabel.toLowerCase(),
      }
      let newFavourUrl = {
        text: currFavour.label.toLowerCase(),
         url : currFavour.url
       };
       // Wenn kein Wikipedia Artikel gefunden wird
      if (currFavour.url == 'en.wikipedia.org'){
        newFavourUrl = {
          text: currFavour.label.toLowerCase(),
          url : 'https://en.wikipedia.org/wiki/Main_Page'
        }
      }

      setAddNewFavour([...addNewFavour,newFavour]);
      setAddNewFavourUrl([...addNewFavourUrl,newFavourUrl]);
      
    }
  };

  /*
  const removeInterest = async (curr) => {
    let newMarkedInterests = addNewMark.filter((i) => i.id !== curr);
    setAddNewMark(newMarkedInterests);
  };
  */
  const validateInterest = (interests, interest) => {
    return interests.some((i) => i.text === interest.toLowerCase());
  };

  const addNewInterest = async (currInterest) => {
    console.log("xx Discover get node link", currInterest)
    let alreadyExist = validateInterest(keywords, currInterest);
    console.log("xx Discover get node link", alreadyExist)
    if (!alreadyExist) {
      console.log("xx Discover get node link already")
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
          id: interest.id,
          source: interest.source
        }
        listOfInterests.push(item);
      });
      console.log("xx Updated list Discover get node link", listOfInterests)
      try {
        await RestAPI.addKeyword(listOfInterests);
      } catch (err) {
        console.log("xx",err);
      }
      // console.log(newInterests)
    }
    console.log("Interest already exists in my list!")
  }

  const elements = getNodeData(data, categoriesChecked, interest);

  const handleOpenLearn = (ele) => {
    const data = ele.data();
    setOpenDialog({...openDialog, openLearn: true, nodeObj: data});
  };

  const handleCloseLearn = () => {
    setOpenDialog({...openDialog, openLearn: false});
  };

  function showConfirmationPopup(ele) {
    swal({
      title: "Are you sure?",
      text: "Do you really want to remove it?",
      icon: "warning",
      buttons: ["Cancel", "Remove"],
      dangerMode: true,
    })
    .then((willRemove) => {
      if (willRemove) {
        let currInterest = ele.data()["label"];
              console.log(currInterest,"test curr");
              let msg =
                "The interest " + currInterest + " has been removed";
              toast.error(msg, {
                toastId: "removedLevel1"
              });
              
              ele.addClass("collapsed");
              ele.successors().addClass("collapsed");
      } else {
        // Der Benutzer hat auf "Abbrechen" geklickt
        console.log("Entfernung abgebrochen");
      }
    });
  }

  function showConfirmationPopup2(ele) {
    swal({
      title: "Are you sure?",
      text: "Do you really want to remove it?",
      icon: "warning",
      buttons: ["Cancel", "Remove"],
      dangerMode: true,
    })
    .then((willRemove) => {
      if (willRemove) {
        let currInterest = ele.data()["label"];
              console.log(currInterest,"test curr");
              let msg =
                "The interest " + currInterest + " has been removed";
              toast.error(msg, {
                toastId: "removedLevel1"
              });
              
              ele.addClass("collapsed");
      } else {
        // Der Benutzer hat auf "Abbrechen" geklickt
        console.log("Entfernung abgebrochen");
      }
    });
  }
  


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
        "font-size": 20
      }
    },
    {
      selector: ".collapsed", // 
      style: {
        display: "none"
      }
    },
    {
      selector: "node[level=0]",
      style: {
        color: "white",
        shape: "rectangle",
        width: 160,
        height: 160
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
  const panzoomstyle = `
  .panzoom-container {
    position: relative;
    z-index: -1;
  }
`;


  return (
    <>
    <div style={{ display: "flex" }}>
    <div style={{ flex: 1 }}>
      <CytoscapeComponent
        elements={elements}
        style={{width: "100%", height: "800px", backgroundColor: "#F8F4F2"}}
        layout={layoutGraph}
        stylesheet={stylesheet}
        zoom={false}
        cy={(cy) => {
          cy.userZoomingEnabled(false);
          cy.elements().remove();
          cy.add(elements);
          //cy.layout(layoutGraph)
          cy.layout(layoutGraph).run();
          cy.fit();
          cy.panzoom(panzoomOptions);
          let defaultsLevel1 = {
            selector: "node[level=1]",
            menuRadius: 80,
            commands: [
              {
                content: "Reload",
                contentStyle: {fontSize: "14px"},
                select: function (ele) {
                  let list = reload(ele.data()["label"])[0];
                  console.log(list, "xxxx");
                  ele.successors().addClass("collapsed");
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
            },
            {content: "Remove", // html/text content to be displayed in the menu
            contentStyle: {fontSize: "14px"}, // css key:value pairs to set the command's css in js if you want
            select: function (ele) {
              showConfirmationPopup(ele);
            },
            enabled: true
            }
            ],
            fillColor: "black", // the background colour of the menu
            activeFillColor: "grey", // the colour used to indicate the selected command
            activePadding: 6, // additional size in pixels for the active command
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

          let defaultsLevel2 = {
            selector: "node[level=2]",
            menuRadius: 80, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
           // selector: "node", // elements matching this Cytoscape.js selector will trigger cxtmenus
            commands: [
              // an array of commands to list in the menu or a function that returns the array

              {
                // example command
                // optional: custom background color for item
                content: "Learn more",
                // html/text content to be displayed in the menu
                contentStyle: {fontSize: "14px"}, // css key:value pairs to set the command's css in js if you want
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
                contentStyle: {fontSize: "14px"}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  showConfirmationPopup2(ele);
                },
                enabled: true

                // whether the command is selectable
              },
              {
                // example command
                //fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Add to my interests", // html/text content to be displayed in the menu
                contentStyle: {fontSize: "14px"}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  // a function to execute when the command is selected
                  let currInterest = ele.data()["label"];
                  console.log("xx currInterest")
                  addNewInterest(currInterest);
                  let msg = "The interest " + currInterest + " has been saved";
                  toast.success(msg, {
                    toastId: "addLevel2"
                  }); // `ele` holds the reference to the active element
                },
                enabled: true // whether the command is selectable
              },
              {
                // example command
                //fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Favour", // html/text content to be displayed in the menu
                contentStyle: {fontSize: "14px"}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                //getElementById(ele.data()["id"])
                 //let currFavourLabel = ele.data()["label"];
                 addFavours(ele.data());
                 console.log('xxx1', toString(ele.data().url))
                 console.log("xx currMarkList", addNewFavour);
                 let msg = "The interest is added in your favourite ";
                 toast.success(msg, {
                  toastId: "addLevel2"
                });
                 
                },
                enabled: true

                // whether the command is selectable
              }
            ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
            fillColor: "black", // the background colour of the menu
            activeFillColor: "grey", // the colour used to indicate the selected command
            activePadding: 6, // additional size in pixels for the active command
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
          let menu1 = cy.cxtmenu(defaultsLevel1);
          
        }
      }
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
      </div>
      </div>
    <div style={{ flex: 1 }}></div>
    <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          marginTop: "20px",
          fontFamily: "Arial, sans-serif",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid #000",
                padding: "8px",
                backgroundColor: "#e5e6ec",
                textAlign: "left",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
              }}
            >
              My favorite interests
            </th>
          </tr>
        </thead>
        <tbody>
          {addNewFavourUrl.map((item) => (
            <tr key={item.text}>
              <td
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px",
                  position: "relative",
                  fontStyle: "italic",
                  background: "#f2f3f6",
                }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#8890aa",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  {item.text}
                </a>
                <button
                  style={{
                    position: "absolute",
                    right: "40px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#333",
                    fontSize: "14px",
                  }}
                  onClick={() => handleDeleteItem(item)}
                >
                  <FaTrash />
                </button>
                <button
                  style={{
                    position: "absolute",
                    right: "80px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#333",
                    fontSize: "14px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #333",
                    backgroundColor: "#bdc2d0",
                  }}
                  onClick={() => {
                    addNewInterest(item.text);
                    let msg = "The interest " + item.text + " has been saved";
                    toast.success(msg, {
                      toastId: "addLevel2",
                    });
                  }}
                >
                  Add to my interersts
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GetNodeLink;
