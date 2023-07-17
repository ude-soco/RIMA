import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import CytoscapeComponent from "react-cytoscapejs";
import { Autocomplete } from "@mui/material";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(cxtmenu);
cytoscape.use(coseBilkent);

const NodeLinkDiagram = ({
  networkDataProp,
  setAuthorProfileToShowProp,
  setAuthorsToCompareProp,
}) => {
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
              console.log("element : ", element.data("label"));
              setAuthorProfileToShowProp({
                label: element.data("id"),
                name: element.data("label"),
              });
            },
          },
          {
            content: "add to compare list",
            select: (element) => {
              setAuthorsToCompareProp({
                label: element.data("id"),
                name: element.data("label"),
              });
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

  const style = {
    width: "100%",
    height: "500px",
    margin: "auto",
  };

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
      {networkDataProp.length > 0 && (
        <Card
          sx={{
            margin: "20px",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "40px",
          }}
        >
          <CardHeader
            title="Co-author network"
            titleTypographyProps={{
              variant: "h4",
              color: "primary",
              textAlign: "center",
            }}
            sx={{ backgroundColor: "secondary", padding: "20px" }}
          />
          <CardContent sx={{ padding: "30px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={selectOption}
              renderInput={(params) => (
                <TextField {...params} label="Search co-authors" />
              )}
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
          </CardContent>
        </Card>
      )}
    </Grid>
  );
};
export default NodeLinkDiagram;
