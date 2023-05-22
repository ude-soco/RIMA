import { Grid, Paper, Button, TextField, Typography, Chip } from "@material-ui/core";
import React, {useEffect,useState} from "react";
import cytoscape from "cytoscape";
import cxtmenu from 'cytoscape-cxtmenu'
import CytoscapeComponent from "react-cytoscapejs";
import { Autocomplete } from "@mui/material";

import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { json } from "d3";
import { ResponsiveEmbed } from "react-bootstrap";
import avsdf from 'cytoscape-avsdf'
cytoscape.use(cxtmenu)
cytoscape.use(avsdf)
const AuthorInsights = () => {
    const [selectedConference,setSelectedConference]=useState(null)
    const [selectedConferences, setSelectedConferences] = useState([])

    const [cy, setCy] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [authorProfileToShow, setAuthorProfileToShow] = useState(null)
    const [compareAuthorslist,setCompareAuthorlist]=useState([])
    const removeHighlight = () => {
        cy.elements().removeClass('faded').removeClass('highlighted');
    }
    const highlightNode = nodeId => {
        let node = cy.$(`#${nodeId}`);
            let directlyConnectedNodes = node.connectedNodes();
            let connectedEdges = node.connectedEdges();
            let indirectlyConnectedNodes = connectedEdges.connectedNodes();
            let connectedElements = directlyConnectedNodes
            .union(connectedEdges)
            .union(indirectlyConnectedNodes);
        if (node.connectedEdges().length === 0) {
            cy.elements().difference(node).removeClass('highlighted').addClass('faded');
                node.addClass('highlighted');
        } else {
            cy.elements().difference(connectedElements).removeClass('highlighted').addClass('faded');
            connectedElements.removeClass('faded').addClass('highlighted')
        }
    }

    useEffect(() => {
        if (cy) {
            const handleMouseoverNode = event => {
                setHoveredNode(event.target.id());
            };
            const handleMouseoutNode = event => {
                setHoveredNode(null);
                removeHighlight();
            }
            cy.on('mouseover', 'node', handleMouseoverNode);
            cy.on('mouseout', 'node', handleMouseoutNode);
            if (hoveredNode) {
                highlightNode(hoveredNode)
            }
            //add context menu to the cytoscape instance
            cy.cxtmenu({
                select: 'node',
                commands: [
                    {
                        content: 'show profile',
                        select: element => {
                            setAuthorProfileToShow(element);
                        }
                    },
                    {
                        content: 'add to compare list',
                        select: element => {
                            compareAuthorslist.push(element);
                        }
                    }
                ]
                
            })
        }
    }, [cy, hoveredNode])
    
    const cytoStyle = [
        {
            selector: 'node',
            style: {
              'background-color': '#66ccff',
              'label': 'data(label)',
              'border-color': '#000',
              'border-width': '1px',
              'shape': 'ellipse',
              'text-wrap': 'wrap',
              'text-max-width': '100px',
              'text-valign': 'center',
              'color': '#000',
                'font-size': '12px',
                'width': '100px',
                'height':'100px',
            },
          },
        {
            selector: 'node[type="type1"]',
            style: {
              'background-color': '#66ccff',
              'label': 'data(label)',
              'border-color': '#000',
              'border-width': '1px',
              'shape': 'ellipse',
            },
          },
          {
            selector: 'node[type="type2"]',
            style: {
              'background-color': '#ff6666',
              'label': 'data(id)',
              'border-color': '#000',
              'border-width': '1px',
              'shape': 'ellipse',
            },
          },
          {
            selector: 'edge[type="type1"]',
            style: {
              'line-color': '#ccc',
              'width': '2px',
            },
          },
          {
            selector: 'edge[type="type2"]',
            style: {
              'line-color': '#aaa',
              'width': '2px',
            },
          },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'curve-style': 'bezier',
          },
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'transition-property': 'background-color, line-color',
            'transition-duration': '0.5s',
          },
        },
        {
          selector: '.faded',
          style: {
            'opacity': 0.25,
            'transition-property': 'opacity',
            'transition-duration': '0.5s',
          },
        },
    ];
    const style = { width: '100%', height: '800px', margin: 'auto' };
    
    const layout = { name: 'cose' };


    const [availableConferences, setAvailableConferences] = useState([])
    const [availableEvents,setAvailableEvents]=useState([])
    useEffect(() => {
        const getConfs = async () => {
            try {
                const response = await fetch(BASE_URL_CONFERENCE  + "conferencesNames");
                const result = await response.json()
                setAvailableConferences(result)
                console.log("availableConferences: ",availableConferences)
            } catch (error) {
                console.log("Error fetching conferences:",error)
            }
        }
        getConfs();
    },[])

    useEffect(() => {
        if (selectedConferences.length >=1 ) {
            const getEvents = async () => {
                try {
                    const confs = selectedConferences.join('&');
                    const response = await fetch(BASE_URL_CONFERENCE + "confEvents/" +confs);
                    const result = await response.json()
                    setAvailableEvents(result.events)
                    
                } catch (error) {
                    console.log("Error fetching events:",error)
                }
            }
            getEvents();
        }
    },[selectedConferences])
    
    useEffect(() => {

    }, [])

    let [networkData, setNetworkData] = useState([])
    let [selectedEvents, setSelectedEvents] = useState([])
    
    const handleGenerateGraph = async () => {
        try {
            if (selectedEvents.length >= 1) {
                setNetworkData([]);
                const selectedEv = selectedEvents.join('&');
               console.log("selectedEv:",selectedEv)
                const response = await fetch(BASE_URL_CONFERENCE +"getNetwokGraph/" + selectedEv);
                const result = await response.json();
                setNetworkData(result.data);
                console.log("result",result.data)
            }
        } catch (error) {
            console.log("Error fetching network date",error)
        }
    }



    return (
        <Grid>
            <Paper
                elevation={6}
                style={{
            padding: "20px",
            maxWidth: "1300px",
                }}>
                <Grid container spacing={2}>
                <Grid item xs={5}>
                <Autocomplete
                    disablePortal
                    options={availableConferences}
                    getOptionLabel={(option) => option.label}
                    filterSelectedOptions
                    value={availableConferences.find( conf => conf.value === selectedConferences )}
                    multiple
                            onChange={(event, e) => {
                                const value = Array.isArray(e) ? e.map((s) => s.value) : [];
                                setSelectedConferences(value);
                            console.log(value)}}

                    renderInput={(params) => (
                        <TextField
                        {...params}
                        variant="outlined"
                        label="Conference name"
                        placeholder="Conferences"
                        />
                        )}
                        />
                </Grid>
                <Grid item xs={5}>
                <Autocomplete
                disablePortal
                noOptionsText="Select conference first"
                options={availableEvents}
                getOptionLabel={(option) => option.label}
                filterSelectedOptions
                multiple
                value={availableEvents.find(event => event.value === selectedEvents)}
                onChange={(event, e) => {
                    const value = Array.isArray(e) ? e.map((s) => s.value) : [];
                    setSelectedEvents(value)
                    console.log("selectedEvents: ",value)
                }}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    variant="outlined"
                    label="Events name"
                    placeholder="Events"
                    />
                )}
                />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    style={{ height: 50 }}
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateGraph}
                  >
                    Generate Graph
                  </Button>
                </Grid>
                </Grid>
            </Paper>
            <br/>
            {networkData.length>0 &&
                <Paper
                elevation={6}
                style={{
            padding: "20px",
            maxWidth: "1300px",
            
            }}>
            <div>
                    
                        <CytoscapeComponent
                        key={networkData}
                    elements={networkData}
                    layout={layout}
                    style={style}
                    stylesheet={cytoStyle}
                    cy={cytoscapeInstance => {
                        if (cytoscapeInstance) {
                            setCy(cytoscapeInstance);
                        }
                    }}
                    />
            </div>
            </Paper>}
        </Grid>
    )
}
export default AuthorInsights;