import { Grid, Paper, Button, TextField, Typography, Chip } from "@material-ui/core";
import React, {useEffect,useState} from "react";
import cytoscape from "cytoscape";
import cxtmenu from 'cytoscape-cxtmenu'
import CytoscapeComponent from "react-cytoscapejs";
import { Autocomplete } from "@mui/material";
cytoscape.use(cxtmenu)

const AuthorInsights = () => {
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
        
        cy.elements().difference(connectedElements).removeClass('highlighted').addClass('faded');
        connectedElements.removeClass('faded').addClass('highlighted')
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
            'background-color': '#666',
            'label': 'data(label)',
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
    const style = { width: '100%', height: '600px', margin: 'auto' };
    const layout = {
        name: 'circle',
        animate: true    };
    const elements = [
        { data: { id: "1", label: "Author 1" } },
        { data: { id: "2", label: "Author 2" } },
        { data: { id: "3", label: "Author 3" } },
        { data: { id: "4", label: "Author 4" } },
        { data: { id: "5", label: "Author 5" } },
        { data: { id: "6", label: "Author 6" } },
        { data: { id: "7", label: "Author 7" } },
        { data: { id: "8", label: "Author 8" } },
        { data: { id: "9", label: "Author 9" } },
        { data: { id: "10", label: "Author 20" } },
        { data: { id: "edge1", source: "1", target: "2" } },
        { data: { id: "edge2", source: "1", target: "3" } },
        { data: { id: "edge3", source: "2", target: "4" } },
        { data: { id: "edge4", source: "3", target: "5" } },
        { data: { id: "edge5", source: "4", target: "5" } },
        { data: { id: "edge6", source: "5", target: "2" } },
        { data: { id: "edge7", source: "6", target: "3" } },
        { data: { id: "edge8", source: "7", target: "4" } },
        { data: { id: "edge9", source: "8", target: "5" } },
        { data: { id: "edge10", source: "10", target: "7" } },
        { data: { id: "edge11", source: "9", target: "7" } },
        { data: { id: "edge12", source: "10", target: "9" } },
        { data: { id: "edge13", source: "1", target: "9" } },
    
    
    ];

    const [availableConferences, setAvailableConferences] = useState([
        {
            label: 'lak', 
            value:'lak'
        },
        {
            label: 'edm', 
            value:'edm'
        },
        {
            label: 'aied', 
            value:'aied'
        }
        
    ])

    const [selectedConference,setSelectedConference]=useState(null)
    const [selectedConferences, setSelectedConferences] = useState([])
    const handleAutoCompleteChange = (event,value) => {
        selectedConferences.push(value)
    }
    const handleDeleteOption = (optionToDelete) => {
        setSelectedConference((prevConferences) => {
            prevConferences.filter((conferences)=> conferences.value !== optionToDelete.value)
        })
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
                    onChange={(value)=> selectedConferences.push(value)}

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
                options={availableConferences}
                getOptionLabel={(option) => option.label}
                filterSelectedOptions
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
                    onClick={(e) => {
                     
                      setTimeout(() => {
                        this.cancelZoom(e);
                      }, 2000);
                    }}
                  >
                    Generate Graph
                  </Button>
                </Grid>
                </Grid>
            </Paper>
            <Paper
                elevation={6}
                style={{
            padding: "20px",
            maxWidth: "1300px",
            
            }}>
            <div>
                <CytoscapeComponent
                    elements={elements}
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
            </Paper>
        </Grid>
    )
}
export default AuthorInsights;