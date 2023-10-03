import React from "react";
import { useState, useCallback } from "react";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";
import SearchBox from "./SearchBox";
import PaperGraphCanvas from "./PaperGraphCanvas";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  Paper
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import ExploreComponent from "./explore";
import cosineSimilarity from "./CosineSim";
import { color } from "highcharts";

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

const PaperGraph = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [elements, setElements] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [paperDetail, setPaperDetail] = useState([]);
  const [paperExplore, setPaperExplore] = useState([]);

  const [anchorElTopic, setAnchorElTopic] = useState(null);
  const [anchorElKeyword, setAnchorElKeyword] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [topicSearchPapers, setTopicSearchPapers] = useState([]);

  const [alltopics, setAllTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);


  // new for view details
  const [openDialog, setOpenDialog] = useState({
    openDetail: null,
    openExplore: null,
    openRelated: null,
  });

  const [layoutGraph,setLayoutGraph]=useState({
    name: "concentric",
    concentric: function (node) {
      return 10 - node.data("level");
    },
    levelWidth: function () {
      return 1;
    },
  });
  const [layoutValue,setLayoutValue]=useState(true)

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
        const temp_array=cluster_info.data(node_id);
        return temp_array[0];
      },
      animate:false});
      setLayoutValue(false);
      const newElements=elements.map((element)=>{
      const node_id=element.data['id'];
      const temp_array=cluster_info.data[node_id];
      console.log(temp_array)
      if (temp_array){
      const index=temp_array[0];
      element.data.color=allColors[index];
    
      element.data.allData.topics=temp_array[1];
      }
      return element;
      })

      let unique_topics = new Set();
      newElements.forEach((element) => {
      if (!element.data.allData) return;
      if (element.data.allData.topics) {
        unique_topics.add(element.data.allData.topics)
      }
    });
    console.log(unique_topics);
      setAllTopics([...unique_topics]);
      setElements(newElements);
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
  };

  /* const onChangeElements=newElements=>{
    setElements(newElements);
  }; */

  const get_set_elements = (temp_elemnts) => {
    let unique_topics = new Set();
    temp_elemnts.forEach((element) => {
      if (!element.data.allData) return;
      if (element.data.allData.topics) {
        element.data.allData.topics.forEach((topic) => {
          unique_topics.add(topic);
        });
      }
    });

    const newElements = temp_elemnts.map((element) => {
      if (!element.data.allData) return element;
      if (element.data.allData.topics) {
        let color = "black";
        let color_is_set = false;
        element.data.allData.topics.forEach((topic) => {
          if (selectedTopics.includes(topic)) {
            let index = [...unique_topics].indexOf(topic);
            if (!color_is_set) {
              color = allColors[index];
              color_is_set = true;
            }
          }
        });
        element.data.color = color;
      }
      return element;
    })


    setAllTopics([...unique_topics]);
    setElements(newElements);
    return newElements;
  };


  const handleExploreByTopicClick = (event) => {
    setAnchorElTopic(event.currentTarget);
  };

  const handleExploreByTopicClose = () => {
    setAnchorElTopic(null);
  };

  const handleExploreByKeywordsClick = (event) => {
    setAnchorElKeyword(event.currentTarget);
  };

  const handleExploreByKeywordsClose = () => {
    setAnchorElKeyword(null);
  };


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    let temp_selected_topics = selectedTopics;
    if (checked) {
      // setSelectedTopics([...selectedTopics, name]);
      temp_selected_topics.push(name);
    } else {
      // setSelectedTopics(selectedTopics.filter((topic) => topic !== name));
      temp_selected_topics = temp_selected_topics.filter((topic) => topic !== name);
    }
    // sort the topics by they order in allTopics
    temp_selected_topics.sort((a, b) => alltopics.indexOf(a) - alltopics.indexOf(b));
    console.log("selected topics: ", temp_selected_topics);

    const newElements = elements.map((element) => {
      if (!element.data.allData) return element;
      if (element.data.allData.topics) {
        let color = "black";
        let color_is_set = false;
        element.data.allData.topics.forEach((topic) => {
          if (temp_selected_topics.includes(topic)) {
            let index = alltopics.indexOf(topic);
            if (!color_is_set) {
              color = allColors[index];
              color_is_set = true;
            }
          }
        });
        element.data.color = color;
      }
      return element;
    });

    setElements(newElements);
    setSelectedTopics(temp_selected_topics);
  };

  const handleTopicSelect = async (topic) => {
    // Implement your topic handling logic
    console.log("Selected topic:", topic);
    const response = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/autocomplete?query=${topic}`
    );

    let paper_ids = response.data.matches.map((match) => match.id);
    // push paperExplore.paper_id at first
    paper_ids.unshift(paperExplore.paper_id);

    // 'https://api.semanticscholar.org/graph/v1/paper/batch',
    // json={"ids": [...]}

    const paper_fields = ['paperId', 'title', 'abstract', 'year', 'authors',
      'referenceCount', 'citationCount', 'fieldsOfStudy',
      'publicationTypes', 'embedding', 'tldr']

    const apiResponse = await axios.post(
      "https://api.semanticscholar.org/graph/v1/paper/batch?fields=" + paper_fields.join(','),
      { ids: paper_ids },
      {
        headers: {
          "Content-Type": "application/json",
        }
      });



    const main_paper = apiResponse.data[0];
    console.log('response >>>> ', main_paper.embedding.vector);
    const other_papers = apiResponse.data.slice(1);
    let papers = other_papers.map((paper) => {
      return {
        ...paper,
        topics: paper.topics,
        keywords: paper.keywords, //add keywords
        similarity: cosineSimilarity(main_paper.embedding.vector, paper.embedding.vector),
        paper_id: paper.paperId,
        citation_count: paper.citationCount,
      }
    });
    papers.sort((a, b) => b.similarity - a.similarity);
    setTopicSearchPapers(papers);
    setAnchorElTopic(null);
    setOpenDialog({ ...openDialog, openRelated: true, openExplore: false });

    handleExploreByTopicClose();
  };

  const handleKeywordSelect1 = (topic) => {
    console.log("Selected topic:", topic);
    try {
      axios.get(
        `https://api.semanticscholar.org/graph/v1/paper/autocomplete?query=${topic}`
      ).then(response => {
        console.log('Topic query')
        let paper_ids = response.data.matches.map((match) => match.id);
        paper_ids.unshift(paperExplore.paper_id);
        const paper_fields = ['paperId', 'title', 'abstract', 'year', 'authors',
          'referenceCount', 'citationCount', 'fieldsOfStudy',
          'publicationTypes', 'embedding', 'tldr']
        console.log(response.data.matches.length)
        console.log(paper_ids.length)
        try {

          axios.post('https://api.semanticscholar.org/graph/v1/paper/batch', {
            params: {
              fields: paper_fields.join(','),
            },
            data:
              { ids: paper_ids },
          }).then(apiResponse => {
            const main_paper = apiResponse.data[0];
            console.log('response >>>> ', main_paper.embedding.vector);
            const other_papers = apiResponse.data.slice(1);
            let papers = other_papers.map((paper) => {
              return {
                ...paper,
                topics: paper.fieldsOfStudy,
                keywords: paper.keywords, //add keywords
                similarity: cosineSimilarity(main_paper.embedding.vector, paper.embedding.vector),
                paper_id: paper.paperId,
                citation_count: paper.citationCount,
              }
            });
            papers.sort((a, b) => b.similarity - a.similarity);
            setTopicSearchPapers(papers);
            setAnchorElKeyword(null);
            setOpenDialog({ ...openDialog, openRelated: true, openExplore: false });

            handleExploreByKeywordsClose();
          })
        } catch (e) {
          console.log(e)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleKeywordSelect = async (topic) => {
     // Implement your topic handling logic
     console.log("Selected topic:", topic);
     const paper_fields = ['paperId', 'title', 'abstract', 'year', 'authors',
     'referenceCount', 'citationCount', 'fieldsOfStudy',
     'publicationTypes', 'embedding', 'tldr']
     const response = await axios.get(
       `https://api.semanticscholar.org/graph/v1/paper/search?query=${topic}&fields=`+paper_fields.join(','),
       {
        headers: {
          "Content-Type": "application/json",
        }}
     );
 
     //let paper_ids = response.data.matches.map((match) => match.paperId);
     // push paperExplore.paper_id at first
     //paper_ids.unshift(paperExplore.paper_id);
 
     // 'https://api.semanticscholar.org/graph/v1/paper/batch',
     // json={"ids": [...]}
 
 
     /* const apiResponse = await axios.post(
       "https://api.semanticscholar.org/graph/v1/paper/batch?fields=" + paper_fields.join(','),
       { ids: paper_ids },
       {
         headers: {
           "Content-Type": "application/json",
         }
       }); */
 
 
 
     const main_paper =paperExplore;
     console.log('response >>>> ', main_paper);
     const main_paper_response=await axios.get("https://api.semanticscholar.org/graph/v1/paper/"+main_paper.paper_id+"?fields=embedding")
     console.log(main_paper_response.data)
     main_paper.embedding=main_paper_response.data.embedding;
     console.log(main_paper.embedding)
     const other_papers = response.data.data;
     console.log(other_papers)
     let papers = other_papers.map((paper) => {
       return {
         ...paper,
         similarity: cosineSimilarity(main_paper.embedding, paper.embedding),
         paper_id: paper.paperId,
         citation_count: paper.citationCount,
       }
     });
     papers.sort((a, b) => b.similarity - a.similarity);
     setTopicSearchPapers(papers);
     setAnchorElKeyword(null);
     setOpenDialog({ ...openDialog, openRelated: true, openExplore: false });
 
     handleExploreByTopicClose();
  }

  const handleExploreByRelatedPapers = (option) => {
    setSelectedOption(option);
  };

  const handleExploreByRelatedPapersSelect = (option) => {
    setSelectedOption(option);
    setOpenDialog({ ...openDialog, openRelated: true, openExplore: false });
    setTopicSearchPapers([]);
  };


  const [irrelevantState, setIrrelevantState] = useState(1);
  function handleIrrelevantStateChange() {
    setIrrelevantState((x) => x + 1);
  }


  const handleOpenDetail = useCallback((ele) => {
    const data = ele.data();

    setPaperDetail({
      title: data.allData.title,
      authors: data.allData.authors.map((item) => { return item.name }),
      year: data.allData.year,
      citation_count: data.allData.citation_count,
      abstract: data.allData.abstract,
      topics: data.allData.topics,
      keywords: data.allData.keywords //add keywords
    })
    setOpenDialog({ ...openDialog, openDetail: true, openExplore: false });
  }, []
  )

  const handleOpenExplore = useCallback((ele) => {

    setSelectedOption(null);
    const data = ele.data();
    setPaperExplore({
      title: data.allData.title,
      paper_id: data.allData.paper_id,
      authors: data.allData.authors.map((item) => { return item.name }),
      year: data.allData.year,
      citation_count: data.allData.citation_count,
      abstract: data.allData.abstract,
      topics: data.allData.topics,
      keywords: data.allData.keywords //add keyword
    })
    console.log("paperExplore");
    console.log(paperExplore);
    setOpenDialog({ ...openDialog, openExplore: true });
  }, []
  )

  const handleCloseDetail = () => {
    setOpenDialog({ ...openDialog, openDetail: false });
  };
  // last code

  // //for submenu of explore

  // const handleSubOption1 = () => {
  //   // Your code for handling sub option 1
  // };

  // const handleSubOption2 = () => {
  //   // Your code for handling sub option 2
  // };


  const handleInputChange = async (event, value) => {
    setSearchQuery(value);
    if (!value) {
      setSuggestions([]);
      return;
    }
    const response = await axios.get(
      `https://api.semanticscholar.org/graph/v1/paper/autocomplete?query=${value}`
    );
    if (response.data && response.data.matches) {
      setSuggestions(response.data.matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (paperId) => {

    let unique_topics = new Set();
    if (!paperId) return;
    const apiResponse = await axios.post(
      "http://localhost:8001/api/paper-explorer/add_paper/",
      { paper_id: paperId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = apiResponse;
    let max_citation_count = data.citation_count;
    data.citations.forEach(element => {
      max_citation_count = Math.max(max_citation_count, element.citation_count);
    });
    data.references.forEach(element => {
      max_citation_count = Math.max(max_citation_count, element.citation_count);
    });

    let newElements = [
      {
        data: {
          id: data.paper_id,
          label: data.title,
          radius: (data.citation_count / max_citation_count) * 80,
          color: "black",
          level: 0,
          allData: { ...data, citations: null, references: null },
        },
      },
      ...data.citations.map((citation) => ({
        data: {
          id: citation.paper_id,
          label: citation.title,
          radius: (citation.citation_count / max_citation_count) * 80,
          color: allColors[citation.topic_group + 1],
          level: 1,
          allData: citation,
        },
      })),
      ...data.references.map((reference) => ({
        data: {
          id: reference.paper_id,
          label: reference.title,
          radius: (reference.citation_count / max_citation_count) * 80,
          color: allColors[reference.topic_group + 1],
          level: 1,
          allData: reference,
        },
      })),
      ...data.citations.map((citation) => ({
        data: {
          source: data.paper_id,
          target: citation.paper_id,
          width: ((citation.similarity + 1) ** 7) / 3,
          color: allColors[citation.topic_group + 1],
        },
      })),
      ...data.references.map((reference) => ({
        data: {
          source: data.paper_id,
          target: reference.paper_id,
          width: ((reference.similarity + 1) ** 7) / 3,
          color: allColors[reference.topic_group + 1],
        },
      })),
    ];

    newElements.forEach((element) => {
      if (!element.data.allData) return;
      if (element.data.allData.topics) {
        element.data.allData.topics.forEach((topic) => {
          unique_topics.add(topic);
        });
      }
    });

    // change colors
    newElements = newElements.map((element) => {
      if (!element.data.allData) return element;
      if (element.data.allData.topics) {
        let color = "black";
        let color_is_set = false;
        element.data.allData.topics.forEach((topic) => {
          if ([...unique_topics].includes(topic)) {
            let index = [...unique_topics].indexOf(topic);
            if (!color_is_set) {
              color = allColors[index];
              color_is_set = true;
            }
          }
        });
        element.data.color = color;
      }
      return element;
    });

    setAllTopics([...unique_topics]);
    setSelectedTopics([...unique_topics]);
    setElements(newElements);
    setSearchQuery("");
    handleIrrelevantStateChange();
  };





  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>

        <Grid item xs={12} md={7}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{ position: "relative", zIndex: 1 }}>
              <Grid item xs={12}>
                <SearchBox
                  suggestions={suggestions}
                  handleInputChange={handleInputChange}
                  onSearch={handleSelect}
                  resetSearchQuery={() => setSearchQuery("")}
                />
              </Grid>
              <Grid item xs={12}>
                <Box fluid>
                  <PaperGraphCanvas
                    key={irrelevantState}
                    // elements={get_elements()}
                    elements={elements}
                    layoutGraph={layoutGraph}
                    layoutValue={layoutValue}
                    //onChangeElements={onChangeElements}
                    onViewDetails={handleOpenDetail}
                    onExploreMore={handleOpenExplore}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Dialog open={openDialog.openDetail} onClose={handleCloseDetail}>
            <DialogTitle>
              {paperDetail.title || 'Title not available'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">Authors</Typography>
                {paperDetail.authors ? (
                  paperDetail.authors.map((author, index) => (
                    <Typography key={index} paragraph>
                      {author}
                    </Typography>
                  ))
                ) : (
                  <Typography paragraph>Authors not available</Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">Year</Typography>
                <Typography paragraph>
                  {paperDetail.year || 'Year not available'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">Citation Count</Typography>
                <Typography paragraph>
                  {paperDetail.citation_count ?? 'Citation count not available'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">Abstract</Typography>
                <Typography paragraph>
                  {paperDetail.abstract || 'Abstract not available'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">fields of study</Typography>
                {paperDetail.fieldsOfStudy ? (
                  paperDetail.fieldsOfStudy.map((fieldOfStudy, index) => (
                    <Typography key={index} paragraph>
                      {fieldOfStudy}
                    </Typography>
                  ))
                ) : (
                  <Typography paragraph>Fields of study not available</Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="h3">Keywords</Typography>
                {paperDetail.keywords ? (
                  paperDetail.keywords.map((keyword, index) => (
                    <Typography key={index} paragraph>
                      {keyword}
                    </Typography>
                  ))
                ) : (
                  <Typography paragraph>Keywords not available</Typography>
                )}
              </Box>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetail}>Close</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openDialog.openExplore} onClose={() => setOpenDialog({ ...openDialog, openExplore: false })}>
            <DialogTitle>Explore</DialogTitle>
            <DialogContent>
              <Button onClick={handleExploreByKeywordsClick}>Explore by Keywords</Button>
              {paperExplore.keywords &&
                <Menu
                  anchorEl={anchorElKeyword}
                  keepMounted
                  open={Boolean(anchorElKeyword)}
                  onClose={handleExploreByKeywordsClose}
                >
                  {paperExplore.keywords && paperExplore.keywords.map((keyword, index) => (
                    <MenuItem key={index} onClick={() => handleKeywordSelect(keyword)}>
                      {/* <MenuItem key={index} onClick={() => handleKeywordSelect(keyword)}> */}
                      {keyword}
                    </MenuItem>
                  ))}
                  {!paperExplore.keywords &&
                    <MenuItem disabled>
                      No keywords available
                    </MenuItem>
                  }

                </Menu>
              }

               {/* <Button onClick={handleExploreByTopicClick}>Explore by Topic</Button>
              {paperExplore.topics &&
                <Menu
                  anchorEl={anchorElTopic}
                  keepMounted
                  open={Boolean(anchorElTopic)}
                  onClose={handleExploreByTopicClose}
                >
                  {paperExplore.topics && paperExplore.topics.map((topic, index) => (
                    <MenuItem key={index} onClick={() => handleTopicSelect(topic)}>
                      {topic}
                    </MenuItem>
                  ))}
                  {!paperExplore.topics &&
                    <MenuItem disabled>
                      No topics available
                    </MenuItem>
                  }

                </Menu>
              } 
 */}

              <Button
                aria-controls="related-papers-menu"
                aria-haspopup="true"
                onClick={(event) =>
                  handleExploreByRelatedPapers(event.currentTarget)
                }
              >
                Explore by Related Papers
              </Button>
              <Menu
                id="related-papers-menu"
                anchorEl={selectedOption}
                keepMounted
                open={Boolean(selectedOption)}
                onClose={() => setSelectedOption(null)}
              >
                <MenuItem onClick={() => handleExploreByRelatedPapersSelect("By Citations and References")}>
                  By Citations and References
                </MenuItem>
                <MenuItem onClick={() => handleExploreByRelatedPapersSelect("By Citations only")}>
                  By Citations only
                </MenuItem>
                <MenuItem onClick={() => handleExploreByRelatedPapersSelect("By References only")}>
                  By References only
                </MenuItem>
              </Menu>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog({ ...openDialog, openExplore: false })} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>

        {openDialog.openRelated && (
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ height: '90vh' }}>
              <Box sx={{ overflowY: 'auto', height: '100%', py: 2, pr: 2, margin: '3%' }}>
                <ExploreComponent
                  main_paper={paperExplore}
                  // by_option="By Citations and References"
                  by_option={selectedOption}
                  setCytoElements={setElements}
                  cytoElements={elements}
                  input_papers={topicSearchPapers}
                  get_set_elements={get_set_elements}
                />
              </Box>
            </Paper>
          </Grid>
        )}
        {Boolean(elements.length) && (
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: 0,
              padding: 1,
              zIndex: 1,
              width: '20%', // Change this value to adjust the width of the box
              height: 'auto', // Change this value to adjust the height of the box
              // overflowY: 'scroll' // Add scroll when the content overflows
            }}
          >
            <Paper elevation={3}>
              <FormControl component="fieldset">
                <FormGroup>
                  {alltopics.map((topic, index) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedTopics.includes(topic)}
                          onChange={handleCheckboxChange}
                          name={topic}
                          style={{ color: allColors[index % allColors.length] || "default" }}
                        />
                      }
                      label={topic}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <div style={{ position: 'flex', bottom: 20, right: 100 }}>
        <Button onClick={() =>clusterData()} variant="contained" color="primary">
          Cluster papers according to topics
        </Button>
      </div>
            </Paper>
      
          </Box>
        )}
      </Box>
    </>
  );
};

export default PaperGraph;