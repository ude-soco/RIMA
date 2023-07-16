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
  Typography,
  Box,
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
import AuthorTopCitedPubs from "./AuthorTopCitedPubs";

const _filterOptions = createFilterOptions();

const AuthorProfile = () => {
  const [optionCount, setOptionCount] = useState(0);
  const [openFitler, setOpenFilter] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  let [networkData, setNetworkData] = useState([]);
  const [authorData, setAuthorData] = useState(null);
  const [mostPublisehd, setMostPublisehd] = useState(true);
  const [selectedConferences, setSelectedConferences] = useState([
    { name: "All Conferences", label: "All Conferences" },
  ]);
  const [conferences, setConferences] = useState([]);
  const [activeLoader, setActiveLoader] = useState(false);
  const orderString = " order by most published author in Descending order";
  useEffect(() => {
    getAuthorFilterBased();
    getAllAvailbelConfs();
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
  const getAllAvailbelConfs = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAllAvailableConferences/"
    );
    const response = await request.json();
    const confs = extractConfsNames(response);
    setConferences(confs);
  };
  const handleClickSearchBarFilter = () => {
    setOpenFilter((prevOpen) => !prevOpen);
  };
  const extractConfsNames = (conferences) => {
    const confs = [];
    conferences.forEach((conf) => {
      if (conf.name !== "All Conferences") confs.push(conf.name);
    });
    return confs;
  };
  const handelMostPublishedAuthors = (MostPublished) => {
    setMostPublisehd(MostPublished);
  };
  const handleSelectedConferences = (selectedConfs) => {
    setSelectedConferences(selectedConfs);
    const confs = extractConfsNames(selectedConfs);
    setConferences(confs);
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
        sx={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
        style={{
          padding: "20px",
          width: "100%",
        }}
      >
        <Grid container xs={12} spacing={2} justify="center">
          <Grid item>
            <PersonSearchIcon color="primary" sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs={10} justify="center" alignItems="center">
            <Grid container xs={12}>
              <Grid item xs={12} style={{ margin: "1%" }}>
                <Typography variant="h6">
                  The list contains all authors published in (
                  {conferences.join(",")}){" "}
                  {conferences.length === 1 ? "conference" : "conferences"}
                  {mostPublisehd && orderString}
                </Typography>
              </Grid>
              <Grid container xs={12}>
                <Grid item xs={11}>
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
                </Grid>
                <Grid
                  item
                  xs={1}
                  style={{
                    marginBottom: "5%",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <Tooltip title="Filter" placement="top">
                    <IconButton onClick={handleClickSearchBarFilter}>
                      <FilterAltIcon
                        color="primary"
                        sx={{ fontSize: 50, marginBottom: "1%" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <ActiveLoader
                  marginLeft={"30%"}
                  height={50}
                  width={50}
                  visible={activeLoader}
                />
              </Grid>
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
            <Grid item xs={12} sx={{ margin: "2px" }}>
              {authorData && <AuthorDetails authorDataProp={authorData} />}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {authorData && (
        <Grid container xs={12} justify="center" alignItems="center">
          <Paper
            sx={{
              width: "100%",
              marginTop: "20px",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              container
              xs={12}
              spacing={1}
              justify="center"
              alignItems="center"
            >
              <Grid item lg={7} xs={12}>
                <ComboBarLineChart AuthorName={selectedAuthor} />
              </Grid>
              <Grid item lg={5} xs={12}>
                {authorData && (
                  <AuthorOverview authorNameProps={selectedAuthor} />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {selectedAuthor && (
        <Paper
          sx={{
            width: "100%",
            marginTop: "20px",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <AuthorTopCitedPubs
            authorNameProps={selectedAuthor}
            conferencesProps={conferences}
          />
        </Paper>
      )}
      <Grid item xs={12}>
        <NodeLinkDiagram networkDataProp={networkData} />
      </Grid>
    </Grid>
  );
};
export default AuthorProfile;
