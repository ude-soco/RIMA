import {
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  Chip,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import CytoscapeComponent from "react-cytoscapejs";
import { Autocomplete } from "@mui/material";
import Select from "react-select";
import SharedAuthorVennDiagram from "./SharedAuthorVennDiagram";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import * as d3 from "d3";
import ColoredBox from "./ColoredBox";
import AuthorProfile from "./AuthorProfile";
cytoscape.use(cxtmenu);

const AuthorInsights = () => {
  const [selectedConferences, setSelectedConferences] = useState([]);
  const [cy, setCy] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [authorProfileToShow, setAuthorProfileToShow] = useState(null);
  const [compareAuthorslist, setCompareAuthorlist] = useState([]);
  const [availableConferences, setAvailableConferences] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  let [networkData, setNetworkData] = useState([]);
  let [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sets, setSets] = useState([]);
  const [isIntersection, setThereIntersection] = useState(false);

  const [confColor, setConfColor] = useState([]);
  const [colors, setColors] = useState([
    "#dae6c5",
    "#d7ece2",
    "#dae6c5",
    "#d7ece2",
  ]);

  const getVennDiagramData = async () => {
    let i = 0;
    try {
      setSets([]);
      const events = selectedEvents.join("&");
      const response = await fetch(
        BASE_URL_CONFERENCE + "getVennDiagramDate/" + events
      );
      const result = await response.json();
      const intersection =
        result.data.length > 1 &&
        result.data.length <= 3 &&
        result.data.slice(-1)[0]["label"].length !== 0;
      setThereIntersection(intersection);
      if (!intersection) {
        return;
      }
      if (result.data) setConfColor([]);
      for (let item of result.data) {
        console.log("i :", i);
        console.log("color number : ", colors[i]);
        setSets((pervSets) => [
          ...pervSets,
          {
            sets: item["sets"],
            size: item["sets"].length == 1 ? 5 : 2,
            label: item["label"].length >= 1 ? item["label"].join(",") : "",
            fill: "#f00",
          },
        ]);
        setConfColor((pervSets) => [
          ...pervSets,
          {
            setName: item["sets"],
            setColor: colors[i],
          },
        ]);
        i++;
      }
    } catch (error) {
      console.log("Error fetch Venn Diagram Data", error);
    }
  };
  const updateVennSets = (nodeId) => {
    let tempSets = [...sets];
    tempSets.forEach((set) => {
      if (set.label.includes(nodeId)) {
        console.log("included node: ", nodeId);
        set.label += " (selected)";
      } else {
        set.label = set.label.replace(" (selected)", "");
      }
    });
    setSets(tempSets);
  };

  useEffect(() => {
    const getConfs = async () => {
      try {
        const response = await fetch(BASE_URL_CONFERENCE + "conferencesNames");
        const result = await response.json();
        setAvailableConferences(result);
        console.log("availableConferences: ", availableConferences);
      } catch (error) {
        console.log("Error fetching conferences:", error);
      }
    };
    getConfs();
  }, []);

  useEffect(() => {
    if (selectedConferences.length >= 1) {
      const getEvents = async () => {
        try {
          const confs = selectedConferences.join("&");
          const response = await fetch(
            BASE_URL_CONFERENCE + "confEvents/" + confs
          );
          const result = await response.json();
          setAvailableEvents(result.events);
        } catch (error) {
          console.log("Error fetching events:", error);
        }
      };
      getEvents();
    }
  }, [selectedConferences]);

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

  const layout = { name: "cose" };

  useEffect(() => {
    setSelectedEvents(["lak2011", "edm2011", "aied2011"]);
  }, []);

  useEffect(() => {
    handleGenerateGraph();
  }, [selectedEvents]);
  const handleGenerateGraph = async () => {
    try {
      if (selectedEvents.length >= 1) {
        setNetworkData([]);
        const selectedEv = selectedEvents.join("&");
        console.log("selectedEv:", selectedEv);
        const response = await fetch(
          BASE_URL_CONFERENCE + "getNetwokGraphEvents/" + selectedEv
        );
        const result = await response.json();
        setNetworkData(result.data);
        console.log("result", result.data);
      }
    } catch (error) {
      console.log("Error fetching network date", error);
    }
  };

  const selectOption = networkData
    .filter((el) => el.data.label)
    .map((el) => ({ value: el.data.id, label: el.data.label }));

  return (
    <Grid
      container
      justify="center"
      sx={{ display: "flex", alignItems: "center", width: "100%" }}
    >
      <AuthorProfile />
    </Grid>
  );
};
export default AuthorInsights;
