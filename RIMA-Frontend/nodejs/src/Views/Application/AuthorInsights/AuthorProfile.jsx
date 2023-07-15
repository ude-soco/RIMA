import {
  Grid,
  List,
  Tooltip,
  ListSubheader,
  InputAdornment,
  TextField,
  Autocomplete,
  Paper,
  createFilterOptions,
  IconButton,
  CardContent,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { BASE_URL_CONFERENCE } from "Services/constants";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import NodeLinkDiagram from "./NodeLinkDiagraom";
import AuthorDetails from "./AuthorDetails";
import AuthorOverview from "./AuthorOverview";
import SearchBarFilterOption from "./SearchBarFilterOption";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import ComboBarLineChart from "./ComboBarLineChart.jsx";

const _filterOptions = createFilterOptions();

const AuthorProfile = () => {
  const [optionCount, setOptionCount] = useState(0);
  const [openFitler, setOpenFilter] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  let [networkData, setNetworkData] = useState([]);
  const [authorData, setAuthorData] = useState(null);
  const [mostPublisehd, setMostPublisehd] = useState(false);
  const [selectedConferences, setSelectedConferences] = useState([
    { name: "All Conferences", label: "All Conferences" },
  ]);
  const [activeLoader, setActiveLoader] = useState(false);
  useEffect(() => {
    getAuthorFilterBased();
  }, []);

  useEffect(() => {
    handleGenerateGraph();
    handleAuhtorData();
  }, [selectedAuthor]);

  useEffect(() => {
    getAuthorFilterBased();
  }, [mostPublisehd, selectedConferences]);

  const getAllAuthorsDB = async () => {
    setActiveLoader(true);
    const request = await fetch(BASE_URL_CONFERENCE + "getAllAvailabeAuthors");
    const response = await request.json();
    setAuthors(response);
    console.log("authors", response);
    setActiveLoader(false);
  };

  const filterOptions = useCallback((option, state) => {
    const results = _filterOptions(option, state);
    if (optionCount !== results.length) {
      setOptionCount(results.length);
    }
    return results;
  });
  const handleGenerateGraph = async () => {
    try {
      console.log("selected Author: ", selectedAuthor);
      if (selectedAuthor !== "") {
        setNetworkData([]);
        const response = await fetch(
          BASE_URL_CONFERENCE + "getNetwokGraphAuthor/" + selectedAuthor.label
        );
        const result = await response.json();
        setNetworkData(result.data);
        console.log(" result: ", result.data);
      }
    } catch (error) {
      console.log("Error fetching network date", error);
    }
  };
  const handleAuhtorData = async () => {
    try {
      console.log("selected Author: ", selectedAuthor);
      if (selectedAuthor !== "") {
        setAuthorData([]);
        const response = await fetch(
          BASE_URL_CONFERENCE + "getAuthorDetails/" + selectedAuthor.label
        );
        const result = await response.json();
        setAuthorData(result.data);
        setOpenFilter(false);
      }
    } catch (error) {
      console.log("Error fetching Author date", error);
    }
  };
  const handleClickSearchBarFilter = () => {
    setOpenFilter((prevOpen) => !prevOpen);
  };

  const handelMostPublishedAuthors = (MostPublished) => {
    setMostPublisehd(MostPublished);
  };
  const handleSelectedConferences = (selectedConfs) => {
    setSelectedConferences(selectedConfs);
    console.log("selectedConfs", selectedConfs);
  };

  const getAuthorFilterBased = async () => {
    setActiveLoader(true);
    let confs = selectedConferences.map((conf) => conf.name);
    if (confs.length == 0) {
      return;
    }
    if (confs.includes("All Conferences")) {
      confs = ["All Conferences"];
    }
    setAuthors([]);
    console.log("conf: ", confs);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getAllAvailabeAuthorsFilterBased/" +
        mostPublisehd +
        "/" +
        confs.join("&")
    );
    const response = await request.json();
    setAuthors(response);
    setActiveLoader(false);
  };
  return (
    <Grid container>
      <Paper
        elevation={6}
        sx={{ margin: "20px", boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
        style={{
          padding: "20px",
          width: "100%",
        }}
      >
        <Grid container xs={12} spacing={2}>
          <Grid item>
            <PersonSearchIcon color="primary" sx={{ fontSize: 20 }} />
          </Grid>
          <Grid item xs={10}>
            <Grid container xs={12}>
              <Autocomplete
                filterOptions={filterOptions}
                disablePortal
                id="combo-box-demo"
                options={authors}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Author" />
                )}
                sx={{ width: "100%", marginBottom: "5%" }}
                onChange={(event, newInputValue) => {
                  if (newInputValue) {
                    setSelectedAuthor(newInputValue);
                  }
                }}
              />
              <ActiveLoader
                marginLeft={"30%"}
                height={50}
                width={50}
                visible={activeLoader}
              />
              {openFitler && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    marginTop: "2%",
                    marginBottom: "1%",
                  }}
                >
                  <SearchBarFilterOption
                    MostPublisehd={handelMostPublishedAuthors}
                    handleSelectedConferences={handleSelectedConferences}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} sx={{ margin: "20px" }}>
              {authorData && <AuthorDetails authorDataProp={authorData} />}
            </Grid>
          </Grid>
          <Grid item>
            <Tooltip title="Filter" placement="top">
              <IconButton onClick={handleClickSearchBarFilter}>
                <FilterAltIcon color="primary" sx={{ fontSize: 50 }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {authorData && (
        <Paper sx={{ width: "100%", margin: "20px" }}>
          <Grid
            container
            justify="center"
            alignItems="flex-start"
            columnSpacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ width: "100%" }}
          >
            <Grid item xs={6}>
              <ComboBarLineChart AuthorName={selectedAuthor}  />
            </Grid>
            <Grid item xs={6}>
              {authorData && (
                <AuthorOverview authorNameProps={selectedAuthor} />
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
      <Grid item xs={12}>
        <NodeLinkDiagram networkDataProp={networkData} />
      </Grid>
    </Grid>
  );
};
export default AuthorProfile;
