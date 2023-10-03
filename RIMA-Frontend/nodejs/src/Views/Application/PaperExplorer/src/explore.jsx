import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Button,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    Menu,
} from "@mui/material";
import YearRangePicker from "./year_range_picker";
import ReactSelect from 'react-select';
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const options = [
    'By Citations and References',
    'By Citations only',
    'By References only',
]

const ExploreComponent = ({ main_paper, by_option, setCytoElements, cytoElements, input_papers, get_set_elements }) => {
    const [relatedPapers, setRelatedPapers] = useState([]);
    const [sortBy, setSortBy] = useState("similairty");
    const [expanded, setExpanded] = useState({});
    const [authors, setAuthors] = useState([]);
    const [allTopics, setAllTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    

    const [filters, setFilters] = useState({
        startYear: null,
        endYear: null,
        topics: [],
        author: 'All',
    });

    useEffect(() => {
        console.log("Main paper changed");
        console.log(by_option);
        let all_authors = new Set();
        let all_topics = new Set();
        if (input_papers && input_papers.length > 0) {
            input_papers.forEach((paper) => {
                paper.authors.forEach((author) => {
                    all_authors.add(author.name);
                });
                if (paper.topics && paper.topics.length>0){
                paper.topics.forEach((topic) => {
                    all_topics.add(topic);
                }
            
            );
                }
            });

            setRelatedPapers(input_papers);
            setAuthors([...all_authors]);
            setAllTopics([...all_topics]);
            setFilters((filters) => ({ ...filters, topics: [...all_topics] }));
            return;
        }

        // Fetch related papers using Axios
        async function fetchRelatedPapers() {
            try {
                console.log("try fetching relatd papers")
                const response = await axios.post(
                    "http://localhost:8001/api/paper-explorer/add_paper/",
                    { paper_id: main_paper.paper_id },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("related papers fetched");
                const references = response.data.references;
                console.log(references)
                const citations = response.data.citations;
                let relatedPapers = [];
                switch (by_option) {
                    case options[0]:
                        relatedPapers = references.concat(citations);
                        break;
                    case options[1]:
                        relatedPapers = citations;
                        break;
                    case options[2]:
                        relatedPapers = references;
                        break;
                    default:
                        relatedPapers = references.concat(citations);
                        break;
                }
                relatedPapers.forEach((paper) => {
                    paper.authors.forEach((author) => {
                        all_authors.add(author.name);
                    }
                    );
                   /*  paper.topics.forEach((topic) => {
                        all_topics.add(topic);
                    } 
                    ); */
                });

                setAllTopics([...all_topics]);
                setFilters((filters) => ({ ...filters, topics: [...all_topics] }));
                setAuthors([...all_authors]);
                setRelatedPapers(relatedPapers);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchRelatedPapers();
    }, [main_paper.paper_id]);

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        console.log("Sort by changed");
        console.log(event.target.value);
        if (event.target.value == "similairty") {
            setRelatedPapers(relatedPapers.sort((a, b) => b.similarity - a.similarity));
        }
        else if (event.target.value == "citation_count") {
            // console.log("citation_count");
            // console.log(relatedPapers.sort((a, b) => b.citation_count - a.citation_count));
            setRelatedPapers(relatedPapers.sort((a, b) => b.citation_count - a.citation_count));
        }
    };

    const handleHidePanel = () => {
        // Your callback logic here
    };

    const handleAddtoNetwork = async (paper) => {
        // check already in network (cytoElements)
        const alreadyInNetwork = cytoElements.find((element) => element.data.id === paper.paper_id);
        let unique_topics = new Set();
        if (!paper.paper_id) return;
        const apiResponse = await axios.post(
        "http://localhost:8001/api/paper-explorer/add_to_network/",
            { paper_id: paper.paper_id },
        {
            headers: {
          "Content-Type": "application/json",
             },
        }
         );
        const { data } = apiResponse;
        if (alreadyInNetwork) {
            alert("Already in network");
            return;
        }
        console.log("add >>>", paper);
        console.log("similarity >>>", paper.similarity);
        console.log("similarity >>>", data.similarity);
        cytoElements.push({
            data: {
                id: data.paper_id,
                label: data.title,
                raduis: 10,
                color: "black",
                level: 1,
                allData: data,
            },
        },
            {
                data: {
                    source: main_paper.paper_id,
                    target: data.paper_id,
                    width: ((paper.similarity + 1) ** 7) / 3,
                }
            }
        );
        get_set_elements(cytoElements);

    };

    const getRelatedPapers = () => {
        let related_papers_temp = relatedPapers;
        if (filters.startYear) {
            related_papers_temp = related_papers_temp.filter((paper) => paper.year >= parseInt(filters.startYear));
        }
        if (filters.endYear) {
            related_papers_temp = related_papers_temp.filter((paper) => paper.year <= filters.endYear);
        }
        if (filters.author !== 'All') {
            related_papers_temp = related_papers_temp.filter((paper) => paper.authors.map((item) => { return item.name }).includes(filters.author));
        }
        //related_papers_temp = related_papers_temp.filter((paper) => paper.topics.some((topic) => filters.topics.includes(topic)));
        return related_papers_temp;
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 200, // set the desired width of the input field here
        }),
    };

    return (
        <Box sx={{ padding: '16px', height: 'auto', zIndex: '1', overflow: 'hidden' }}>
            <Button onClick={handleHidePanel}>&lt;- Hide panel</Button>
            <Typography variant="h4">{main_paper.title}</Typography>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary="Year" />
                    <YearRangePicker setFilters={setFilters} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Author" />
                    <ReactSelect
                        value={filters.author}
                        options={['All', ...authors].map((author) => ({ value: author, label: author }))}
                        onChange={(value) => {
                            setFilters((filters) => ({ ...filters, author: value.value }));
                        }}
                        placeholder={filters.author}
                        styles={customStyles}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Topic" />
                    <FormControl component="fieldset">
                        <FormGroup style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {allTopics.map((topic, index) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.topics.includes(topic)}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setFilters((filters) => ({ ...filters, topics: [...filters.topics, topic] }));
                                                } else {
                                                    setFilters((filters) => ({ ...filters, topics: filters.topics.filter((t) => t !== topic) }));
                                                }
                                            }}
                                            name={topic}
                                        />
                                    }
                                    label={topic}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </ListItem>
            </List>
            <FormControl fullWidth variant="standard">
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} onChange={handleSortChange}>
                    <MenuItem value={"similairty"}>Similarity</MenuItem>
                    <MenuItem value={"citation_count"}>Citation Count</MenuItem>
                </Select>
            </FormControl>
            <Divider />
            <List>
                {getRelatedPapers().map((paper, index) => (
                    <Box key={index} sx={{ marginTop: 2 }}>
                        <Typography>
                            {paper.paper_number} Similarity Score: {(paper.similarity * 100).toFixed(2)} %
                        </Typography>
                        <Typography variant="h6">{paper.title}</Typography>
                        <Typography>
                            {/* {paper.authors} */}
                            {paper.authors.map((item) => { return item.name }).join(", ")} ({paper.year})
                        </Typography>
                        <Typography>Citation Count: {paper.citation_count}</Typography>
                        {/* <Typography>Topics: {paper.topics.join(", ")}</Typography> */}
                        {paper.abstract ?
                            <Box>
                                <Typography>
                                    {/* Abstract: {paper.abstract} */}
                                    Abstract: {paper.abstract?.substring(0, 200)}
                                    <Collapse in={expanded[index]}>{paper.abstract?.substring(200)}</Collapse>
                                    {paper.abstract?.length > 200 && "…"}
                                </Typography>
                                <Button
                                    onClick={() => {
                                        setExpanded({ ...expanded, [index]: !expanded[index] });
                                    }}
                                >
                                    {expanded[index] ? "See Less" : "See More"}
                                </Button>
                            </Box>
                            :
                            <Typography>
                                Abstract: N/A
                            </Typography>
                        }

                        <Button onClick={() => { handleAddtoNetwork(paper) }}>
                            + Add to Network
                        </Button>
                        <Divider />
                    </Box>
                ))}
            </List>
        </Box>
    );
};

export default ExploreComponent;