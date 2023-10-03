import React, { useState, memo } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import "cytoscape-context-menus/cytoscape-context-menus.css";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
//new for detail
import contextMenus from "cytoscape-context-menus";
import "cytoscape-context-menus/cytoscape-context-menus.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from './Tooltip';
import { Paper, Typography, Box } from '@mui/material';
import cise from 'cytoscape-cise';
import Button from '@mui/material/Button';
import axios from "axios";
import { color } from "highcharts";

cytoscape.use(contextMenus, cytoscape);
cytoscape.use(cxtmenu);
cytoscape.use( cise );

const PaperGraphCanvas = memo(({ elements,layoutGraph,layoutValue,onViewDetails, onExploreMore }) => {

  const [tooltip, setTooltip] = useState({ show: false, position: { x: 0, y: 0 }, content: '' });
  const allColors = [
    // "#397367",
    // "#160C28",
    // "#EFCB68",
    // "#C89FA3",
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
  //const [elements, setElements] = useState(elements);
  /* const [layoutGraph,setLayoutGraph]=useState({
    name: "concentric",
    concentric: function (node) {
      return 10 - node.data("level");
    },
    levelWidth: function () {
      return 1;
    },
  }); */
  /* const [layoutValue,setLayoutValue]=useState(true) */
  const [isNodeDragging, setIsNodeDragging] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
/* 
  const clusterData = async () => {
    alert('clicked');
    console.log(elements);

    const cluster_info = await axios.post(
      "http://localhost:8001/api/paper-explorer/cluster_papers/",
      { elements },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(cluster_info);
    if (layoutValue)
    { setLayoutGraph({name:"cise",
      cluster_info: function(node){
        const node_id=node.data('id');
        console.log(cluster_info.data(node_id))
        return cluster_info.data(node_id);
      },
      animate:false});
      setLayoutValue(false);
      const newElements=elements.map((element)=>{
      const node_id=element.data['id'];
      const index=cluster_info.data[node_id];
      element.data.color=allColors[index];
      return element;
      })
      //onChangeElements(newElements);
    }
    else{
      setLayoutGraph({
        name: "concentric",
        concentric: function (node) {
          return 10 - node.data("level");
        },
        levelWidth: function () {
          return 1;
        },
      });
      setLayoutValue(true);
    }
  }; */



  const initCytoscapeContextMenu = (cy, onViewDetails, onExploreMore) => {
    cy.contextMenus({
      menuItems: [
        {
          id: "view-details",
          content: "View details",
          selector: "node",
          onClickFunction: (event) => {
            const target = event.target || event.cyTarget;
            onViewDetails(target);
          },
          hasTrailingDivider: true,
        },
        {
          id: "explore-more",
          content: "Explore more",
          selector: "node",
          onClickFunction: (event) => {
            const target = event.target || event.cyTarget;
            onExploreMore(target);
          },
        },
      ],
    });
  };

  const stylesheet = [
    {
      selector: "node",
      style: {
        width: 200,
        height: 200,
        label: "data(label)",
        "background-color": "data(color)",
        color: "white",
        width: "mapData(radius, 0, 100, 30, 100)", // Map the radius property to width
        height: "mapData(radius, 0, 100, 30, 100)", // Map the radius property to height
      },
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        'width': (ele) => ele.data('width'),
        // make edges end to center of node
        // "target-arrow-shape": "triangle",
        "target-endpoint": "inside-to-node",
        // inverse of the date color for line color
        // 'line-color': 'data(color)',
      },
    },
    {
      selector: "node[label]",
      style: {
        "text-halign": "left",
        "text-valign": "upright",
        "text-wrap": "wrap",
        "text-max-width": 150, // increase max-width to allow longer lines before wrapping
        "font-size": 8,
        "text-background-color": "black",
        "text-background-opacity": 0.8,
        "text-background-shape": "roundrectangle",
        "text-background-padding": 4,
        "text-margin-x": 10, // adjust margin to move the text away from the node
        "text-margin-y": -10, // adjust margin to move the text away from the node
      },
    },
    {
      selector: ".collapsed",
      style: {
        display: "none",
      },
    },
    {
      selector: ".level1",
      style: {
        "line-color": "red",
        "color": "red",
      },
    },
    {
      selector: ".level2",
      style: {
        "background-opacity": 0.6,
        "line-color": "red",
        "color": "red",
      },
    },
    {
      selector: ".level3",
      style: {
        "background-opacity": 0.4,
        "line-color": "red",
        "color": "red",
      },
    },
  ];

  return (
    <>
      <CytoscapeComponent
        // ref={cyRef}
        elements={elements}
        layout={layoutGraph}
        stylesheet={stylesheet}
        style={{ width: "100%", height: "800px", position: "absolute", top: 0, left: 0, zIndex: 5 }}
        onInit={(cy) => initCytoscapeContextMenu(cy, onViewDetails)}
        cy={(cy) => {
          cy.elements().remove();
          cy.add(elements);
          //cy.layout(layoutGraph)
          cy.layout(layoutGraph).run();
          // cy.cxtmenu(defaultsLevel2);

          // cy.on('drag', 'node', () => {
          //   setIsNodeDragging(true);
          // });

          // cy.on('dragfree', 'node', () => {
          //   setIsNodeDragging(false);
          // });

          // cy.on('cxttapstart', (event) => {
          //   setIsContextMenuOpen(true);
          // });

          // cy.on('cxttapend', (event) => {
          //   setIsContextMenuOpen(false);
          // });


          // cy.on('mouseover', 'node', (event) => {

          //   if (tooltip.show) {
          //     console.log('tooltip already shown');
          //     return;
          //   }

          //   const target = event.target;
          //   const node_x = target.renderedPosition('x');
          //   const node_y = target.renderedPosition('y');

          //   // console.log('----------------');
          //   // console.log(target.data)
          //   const allData = target.data('allData');
          //   const content = (
          //     <Paper elevation={3} sx={{ padding: 1 }}>
          //       <Typography variant="subtitle1" gutterBottom>
          //         <strong>Title:</strong> {target.data('label')}
          //       </Typography>
          //       <Typography variant="body2" gutterBottom>
          //         <strong>Authors:</strong> {allData.authors[0].name}
          //       </Typography>
          //       <Typography variant="body2" gutterBottom>
          //         <strong>Year:</strong> {allData.year}
          //       </Typography>
          //       <Typography variant="body2" gutterBottom>
          //         <strong>Citation Count:</strong> {allData.citation_count}
          //       </Typography>
          //     </Paper>
          //   );

          //   setTooltip({ show: true, position: { x: node_x, y: node_y }, content: content });
          // });

          // cy.on('mouseout', 'node', () => {    
          //   setTooltip({ show: false, position: { x: 0, y: 0 }, content: '' });
          // });


          cy.fit();

          let defaultsLevel1 = {
            selector: "node[level=1]",
            menuRadius: 75, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
            //selector: "node", // elements matching this Cytoscape.js selector will trigger cxtmenus
            commands: [
              // an array of commands to list in the menu or a function that returns the array

              {
                // example command
                fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "View details", // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  // a function to execute when the command is selected
                  onViewDetails(ele);

                  console.log(ele.data()); // `ele` holds the reference to the active element
                },
                enabled: true, // whether the command is selectable
              },
              {
                // example command
                fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Explore", // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  onExploreMore(ele);
                },
                enabled: true, // whether the command is selectable
              },
              {
                // example command
                fillColor: "rgba(200, 200, 200, 0.75)", // optional: custom background color for item
                content: "Remove", // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) {
                  // a function to execute when the command is selected
                  console.log(ele.data()); // `ele` holds the reference to the active element
                  let currInterest = ele.data()["label"];
                  let msg = "The interest " + currInterest + " has been removed";
                  toast.error(msg, {
                    toastId: "removedLevel2"
                  });
                  ele.remove(); // This line removes the element from the graph
                },
                enabled: true, // whether the command is selectable
              },
            ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
            fillColor: "rgba(0, 0, 0, 0.75)", // the background colour of the menu
            activeFillColor: "rgba(1, 105, 217, 0.75)", // the colour used to indicate the selected command
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
            outsideMenuCancel: 8, // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given
          };

          let defaultsLevel0 = {
            ...defaultsLevel1,
            selector: "node[level=0]",
          };

          let menu1 = cy.cxtmenu(defaultsLevel1);
          let menu0 = cy.cxtmenu(defaultsLevel0);
        }}
      />
      <Tooltip show={tooltip.show} position={tooltip.position} content={tooltip.content} />
    </>
  );
}
);

export default PaperGraphCanvas;