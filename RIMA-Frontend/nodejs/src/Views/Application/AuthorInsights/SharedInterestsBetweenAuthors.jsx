// created by Islam Abdelghaffar

import React, { useEffec, useState } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import { Grid, Typography, Box, Autocomplete, TextField } from "@mui/material";

import { useEffect } from "react";
import RIMAButton from "../ReuseableComponents/RIMAButton";
import InteractiveVennDiagram from "../ReuseableComponents/InteractiveVennDiagram";
import PublicationDialog from "Views/components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog";

const SharedInterestsBetweenAuthors = () => {
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loader, setActiveLoader] = useState(false);
  const [authors, setAuthors] = useState([{ name: "A1", label: 1 }]);
  const [selectedConferences, setSelectedConferences] = useState([]);
  const [selectedAuthor, setSelectedAuthors] = useState([]);
  const [selectedAuthorsNames, setSelectedAuthorsNames] = useState([]);
  const [availableConfs, setConferences] = useState([]);
  const [activeButton, setActiveButton] = useState(false);
  const [compareClicked, setCompareClicked] = useState(false);
  const [selectedAuthorsObjects, setSelectedAuthorsObjects] = useState([]);

  const [listContent, setListContent] = useState([""]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [sets, SetSets] = useState([
    { sets: ["R. Baker"], value: 10, name: "R. Baker" },
    { sets: ["B. Gasv"], value: 20, name: "B. Gasv" },
    { sets: ["Fritz Ray"], value: 20, name: "Fritz Ray" },
    { sets: ["R. Baker", "B. Gasv"], value: 5, name: "R. Baker_B. Gasv" },
    { sets: ["R. Baker", "Fritz Ray"], value: 5, name: "R. Baker_Fritz Ray" },
    { sets: ["B. Gasv", "Fritz Ray"], value: 10, name: "B. Gasv_Fritz Ray" },
    {
      sets: ["R. Baker", "B. Gasv", "Fritz Ray"],
      value: 5,
      name: "R. Baker_B. Gasv_Fritz Ray",
    },
  ]);
  const [showWarning, setShowWarning] = useState(false);
  const [showSimilarityWarning, setShowSimilarityWarning] = useState(false);
  const [selectedSet, setSelectedSet] = useState([]);
  useEffect(() => {
    getAllAuthorsDB();
    getAllAvailbelConfs();
  }, []);
  const handleGetselectedSet = (set) => {
    let selectedAuthorsNames = set.split("and").map((name) => name.trim());
    let selectedAuthorsIds = selectedAuthorsObjects
      .filter((author) => selectedAuthorsNames.includes(author.name))
      .map((author) => author.label);

    setSelectedSet(selectedAuthorsIds);
  };
  const getAllAuthorsDB = async () => {
    setActiveLoader(true);
    const request = await fetch(BASE_URL_CONFERENCE + "authors/allAuthors/");

    const response = await request.json();
    setAuthors(response);
    console.log("authors", response);
    setActiveLoader(false);
  };

  const getAllAvailbelConfs = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "conferences/allConferences/"
    );
    const response = await request.json();
    const confs = extractConfsNames(response);
    setConferences(confs);
  };

  const extractConfsNames = (conferences) => {
    const confs = [];
    conferences.forEach((conf) => {
      if (conf.name !== "All Conferences") confs.push(conf.name);
    });
    return confs;
  };

  const getSharedInterestsCount = async () => {
    if (selectedAuthor.length == 0 || selectedConferences.length == 0) {
      return;
    }
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "authors/authorsId/" +
        selectedAuthor.join("&") +
        "/inConferences/" +
        selectedConferences.join("&") +
        "/sharedInterests/"
    );
    const response = await request.json();
    SetSets(response.sets);
    setListContent(response.names);
    setShowWarning(false);
    setShowSimilarityWarning(false);
  };

  const handleCompare = () => {
    setCompareClicked(true);
    getSharedInterestsCount();
  };
  const handleGetPublications = async (keyword) => {
    try {
      setSelectedKeyword([keyword]);
      const request = await fetch(
        BASE_URL_CONFERENCE +
          "authors/authorsId/" +
          selectedSet.join("&") +
          "/interest/" +
          keyword +
          "/"
      );
      const response = await request.json();
      console.log("resonse: ", response);
      setPublicationList(response.publicationList);
      setOpenDialog(true);
    } catch (erroe) {
      console.log("Error while fetching publication for keyword: ", keyword);
    }
  };
  const handleCloseDiaglog = () => {
    setOpenDialog(false);
  };
  return (
    <Grid
      container
      style={{
        padding: "2%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Grid container xs={12}>
        <Typography
          style={{ fontWeight: "bold" }}
          variant="h5"
          component="h1"
          gutterBottom
        >
          Comparing Authors'Interests Across Multiple Conferences
        </Typography>
        <Grid container xs={12} marginBottom="1%">
          <Typography variant="h6">
            The Venn diagram shows the shared topics bewteen selected authors in
            selected conferences{" "}
            {compareClicked && selectedAuthorsNames.length > 0 && (
              <>
                by {selectedAuthorsNames.join(" and ")} at the{" "}
                <b>{selectedConferences.join(" and ")} conferences</b>
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container xs={12}>
          <Autocomplete
            disablePortal
            multiple={true}
            id="combo-box-demo"
            options={authors}
            key={(option) => option.label}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Author" />}
            sx={{ width: "100%", marginBottom: "1%" }}
            onChange={(event, newInputValue) => {
              if (newInputValue) {
                var labels = newInputValue.map((v) => v.label);
                var names = newInputValue.map((v) => v.name);
                setSelectedAuthorsObjects(newInputValue);
                setSelectedAuthors(labels);
                setSelectedAuthorsNames(names);
              }
            }}
          />
        </Grid>
        <Grid container xs={6}>
          <Box sx={{ minWidth: "100%" }}>
            <Autocomplete
              disablePortal
              multiple={true}
              id="combo-box-demo"
              options={availableConfs}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Conferences" />
              )}
              sx={{ width: "100%", marginBottom: "1%" }}
              onChange={(event, newInputValue) => {
                if (newInputValue) {
                  setSelectedConferences(newInputValue);
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid>
        <RIMAButton
          name="Compare"
          onClick={handleCompare}
          activeButton={activeButton}
        />
      </Grid>
      <Grid
        item
        xs={12}
        style={{ marginTop: "1%" }}
        padding="5%"
        sx={{
          width: "100%",
          padding: "1%",
          borderRadius: "40px",
        }}
      >
        <Grid>
          {listContent.length > 0 && (
            <InteractiveVennDiagram
              sets={sets}
              listContent={listContent}
              label={"topic"}
              handleGetPublications={handleGetPublications}
              selectedAuthorSet={handleGetselectedSet}
              IsAuthor={true}
            />
          )}
        </Grid>
        {publicationList && publicationList.length > 0 && (
          <PublicationDialog
            openDialogProps={openDialog}
            papersProps={publicationList}
            handleCloseDiaglog={handleCloseDiaglog}
            originalKeywordsProps={selectedKeyword}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default SharedInterestsBetweenAuthors;
