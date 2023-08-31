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
import AllAuthorPublication from "./AllAuthorPublication";
import PublicationWordCloud from "./PublicationWordCloud";
import InterestsAnalysis from "./InterestsAnalysis.jsx";

const _filterOptions = createFilterOptions();

const AuthorProfile = () => {
  const [selectedPublication, setSelectedPublication] = useState({});
  const [optionCount, setOptionCount] = useState(0);
  const [openFitler, setOpenFilter] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authorsToCompare, setAuthorsToCompare] = useState([]);
  const [authors, setAuthors] = useState([]);
  let [networkData, setNetworkData] = useState([]);
  const [authorData, setAuthorData] = useState(null);
  const [mostPublisehd, setMostPublisehd] = useState(false);
  const [authorToShowProfile, setAuthorsToShowProfile] = useState(null);
  const [selectedConferences, setSelectedConferences] = useState([
    { name: "All Conferences", label: "All Conferences" },
  ]);
  const [conferences, setConferences] = useState([]);
  const [authorConfs, setAuthorConfs] = useState([]);
  const [activeLoader, setActiveLoader] = useState(false);
  const orderString = (
    <>
      The authors are ordered based on their publication count,
      <strong>
        with the most published author appearing at the top of the list
      </strong>{" "}
      in descending order. This ranking allows for easy identification of the
      most top contributors in
      {conferences.length === 1 ? " this conference" : " these conferences."}
    </>
  );

  useEffect(() => {
    getAuthorFilterBased();
    getAllAvailbelConfs();
  }, []);

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    let authorParam = urlParams.get("author");
    if (authorParam) {
      let author = Object.fromEntries(new URLSearchParams(authorParam));
      console.log("auhtor to show profile: ", author);
      if (author.name !== null && author.label !== null) {
        console.log("shown");
        setAuthorsToShowProfile(author);
      }
    }
  }, []);

  useEffect(() => {
    if (
      authorToShowProfile !== null &&
      authorToShowProfile.name !== null &&
      authorToShowProfile.label !== null
    ) {
      console.log("author to show profile is set");
      setSelectedAuthor(authorToShowProfile);
    }
  }, [authorToShowProfile]);

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
        setAuthorConfs(result.confs);
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
  const handleSelectedPublication = (publication) => {
    setSelectedPublication(publication);
  };
  const showCoAuthorPropfile = (author) => {
    console.log("author to send", author);
    let queryParam = new URLSearchParams(author).toString();
    window.open(window.location.href + "?author=" + queryParam, "_blank");
    //setSelectedAuthor(author);
  };
  const handleSetAuthorsToCompare = (author) => {
    let isExists = authorsToCompare.some((a) => a.label === author.label);
    if (!isExists) {
      setAuthorsToCompare((prev) => [...prev, author]);
    }
  };
  return (
    <Grid container>
      <Paper
        elevation={6}
        sx={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
        style={{
          padding: "20px",
          width: "100%",
          borderRadius: "40px",
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
                  The list contains all authors who have published in
                  <b> ({conferences.join(",")})</b>{" "}
                  {conferences.length === 1 ? "conference" : "conferences"}.
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
              borderRadius: "40px",
            }}
          >
            <Grid container spacing={2} justify="center" alignItems="center">
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
        <Grid container justify="center" alignItems="center">
          <Paper
            sx={{
              width: "100%",
              marginTop: "20px",
              alignContent: "center",
              alignItems: "center",
              borderRadius: "40px",
            }}
          >
            <Grid
              container
              xs={12}
              spacing={2}
              justify="center"
              alignItems="center"
            >
              {/* <Grid item lg={5} xs={12}>
                <AllAuthorPublication
                  authorNameProps={selectedAuthor}
                  conferencesProps={conferences}
                  selectedPublicationProp={handleSelectedPublication}
                />
              </Grid> */}
              <Grid item xs={12}>
                <PublicationWordCloud
                  authorNameProps={selectedAuthor}
                  PublicationProp={selectedPublication}
                  conferencesProps={conferences}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {selectedAuthor && (
        <Grid container xs={12} justify="center" alignItems="center">
          <Paper
            sx={{
              width: "100%",
              marginTop: "20px",
              alignContent: "center",
              alignItems: "center",
              borderRadius: "40px",
            }}
          >
            <Grid
              item
              xs={12}
              spacing={2}
              padding="1%"
              justify="center"
              alignItems="center"
            >
              <InterestsAnalysis
                authorProp={selectedAuthor}
                allAvailableConfProps={conferences}
              />
            </Grid>
          </Paper>
        </Grid>
      )}
      <Grid item xs={12}>
        <NodeLinkDiagram
          networkDataProp={networkData}
          setAuthorProfileToShowProp={showCoAuthorPropfile}
          setAuthorsToCompareProp={handleSetAuthorsToCompare}
          allAvailableConfProps={authorConfs}
        />
      </Grid>
    </Grid>
  );
};
export default AuthorProfile;
