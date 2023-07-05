import { Grid, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import CytoscapeComponent from "react-cytoscapejs";
import { Autocomplete } from "@mui/material";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(cxtmenu);
cytoscape.use(coseBilkent);

const NodeLinkDiagram = ({ networkDataProp }) => {
  const [cy, setCy] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [authorProfileToShow, setAuthorProfileToShow] = useState(null);
  const [compareAuthorslist, setCompareAuthorlist] = useState([]);
  let [networkData, setNetworkData] = useState(networkDataProp);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (cy) {
      const handleMouseoverNode = (event) => {
        setHoveredNode(event.target.id());
      };
      const handleMouseoutNode = (event) => {
        setHoveredNode(null);
        removeHighlight();
      };
      cy.on("mouseover", "node", handleMouseoverNode);
      cy.on("mouseout", "node", handleMouseoutNode);
      if (hoveredNode) {
        highlightNode(hoveredNode);
      }
      //add context menu to the cytoscape instance
      cy.cxtmenu({
        select: "node",
        commands: [
          {
            content: "show profile",
            select: (element) => {
              setAuthorProfileToShow(element);
            },
          },
          {
            content: "add to compare list",
            select: (element) => {
              compareAuthorslist.push(element);
            },
          },
        ],
      });
    }
  }, [cy, hoveredNode]);

  const removeHighlight = () => {
    cy.elements().removeClass("faded").removeClass("highlighted");
  };

  const highlightNode = (nodeId) => {
    console.log("node: ", nodeId);
    let node = cy.$(`#${nodeId}`);
    let directlyConnectedNodes = node.connectedNodes();
    let connectedEdges = node.connectedEdges();
    let indirectlyConnectedNodes = connectedEdges.connectedNodes();
    let connectedElements = directlyConnectedNodes
      .union(connectedEdges)
      .union(indirectlyConnectedNodes);
    if (node.connectedEdges().length === 0) {
      cy.elements()
        .difference(node)
        .removeClass("highlighted")
        .addClass("faded");
      node.addClass("highlighted");
    } else {
      cy.elements()
        .difference(connectedElements)
        .removeClass("highlighted")
        .addClass("faded");
      connectedElements.removeClass("faded").addClass("highlighted");
    }
  };

  const cytoStyle = [
    {
      selector: "node",
      style: {
        "background-color": "#66ccff",
        label: "data(label)",
        "border-color": "#000",
        "border-width": "1px",
        shape: "ellipse",
        "text-wrap": "wrap",
        "text-max-width": "100px",
        "text-valign": "center",
        color: "#000",
        "font-size": "12px",
        width: "100px",
        height: "100px",
      },
    },
    {
      selector: 'node[type="type1"]',
      style: {
        "background-color": "#66ccff",
        label: "data(label)",
        "border-color": "#000",
        "border-width": "1px",
        shape: "ellipse",
      },
    },
    {
      selector: 'node[type="type2"]',
      style: {
        "background-color": "#ff6666",
        label: "data(id)",
        "border-color": "#000",
        "border-width": "1px",
        shape: "ellipse",
      },
    },
    {
      selector: 'edge[type="type1"]',
      style: {
        "line-color": "#ccc",
        width: "2px",
      },
    },
    {
      selector: 'edge[type="type2"]',
      style: {
        "line-color": "#aaa",
        width: "2px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "curve-style": "bezier",
      },
    },
    {
      selector: ".highlighted",
      style: {
        "background-color": "#61bffc",
        "line-color": "#61bffc",
        "transition-property": "background-color, line-color",
        "transition-duration": "0.5s",
      },
    },
    {
      selector: ".faded",
      style: {
        opacity: 0.25,
        "transition-property": "opacity",
        "transition-duration": "0.5s",
      },
    },
  ];

  const style = { width: "100%", height: "800px", margin: "auto" };

  const layout = {
    name: "cose-bilkent",
    nodeRepulsion: 7000,
    idealEdgeLength: 300,
    animate: true,
    fit: true,
  };

  const selectOption = networkDataProp
    .filter((el) => el.data.label)
    .map((el) => ({ value: el.data.id, label: el.data.label }));

  return (
    <Grid>
      <br />
      {networkDataProp.length > 0 && (
        <Paper
          elevation={6}
          style={{
            padding: "20px",
            maxWidth: "1300px",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={selectOption}
            renderInput={(params) => <TextField {...params} label="Author" />}
            onChange={(e1, e) => {
              setSelectedNode(e ? e.label : null);
              if (e) {
                highlightNode(e.value);
              }
            }}
            onInputChange={removeHighlight}
          />
          <div>
            <CytoscapeComponent
              key={networkDataProp}
              elements={networkDataProp}
              layout={layout}
              style={style}
              stylesheet={cytoStyle}
              cy={(cytoscapeInstance) => {
                if (cytoscapeInstance) {
                  setCy(cytoscapeInstance);
                }
              }}
            />
          </div>
        </Paper>
      )}
    </Grid>
  );
};
export default NodeLinkDiagram;
