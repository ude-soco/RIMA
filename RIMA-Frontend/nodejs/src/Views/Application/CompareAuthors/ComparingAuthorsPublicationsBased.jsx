// created by Islam Abdelghaffar

import React, { useEffec, useState } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import FilterButton from "../AuthorInsights/FilterButton";
import {
  IconButton,
  Tooltip,
  Grid,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import StackedBarChart from "../AuthorInsights/stackedBarchart";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useEffect } from "react";
import RIMAButton from "../ReuseableComponents/RIMAButton";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import InteractiveVennDiagram from "../ReuseableComponents/InteractiveVennDiagram";
import PublicationDialog from "Views/components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog";

const CompareAuthorsStackedBarChart = () => {
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredConfsName, setFilteredConfsName] = useState([]);
  const [loader, setActiveLoader] = useState(false);
  const [authors, setAuthors] = useState([{ name: "A1", label: 1 }]);
  const [selectedConferences, setSelectedConferences] = useState([]);
  const [selectedAuthor, setSelectedAuthors] = useState([]);
  const [selectedAuthorsNames, setSelectedAuthorsNames] = useState([]);
  const [availableConfs, setConferences] = useState([]);
  const [activeButton, setActiveButton] = useState(false);
  const [compareClicked, setCompareClicked] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const [stackedBarData, setStackedBarData] = useState({
    options: {
      chart: {
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      height: 200,
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [
          2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
        ],
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " Publications";
          },
        },
      },
      fill: {
        opacity: 1,
      },
    },
    series: [
      {
        name: "edm",
        data: [4, 5, 6, 8, 7, 6, 5, 4, 5, 4],
      },
      {
        name: "lak",
        data: [3, 5, 7, 9, 8, 7, 6, 5, 4, 3],
      },
    ],
  });
  const [listContent, setListContent] = useState(["P1", "P2", "P3"]);

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

  useEffect(() => {
    getAllAuthorsDB();
    getAllAvailbelConfs();
  }, []);
  const getAllAuthorsDB = async () => {
    setActiveLoader(true);
    const request = await fetch(BASE_URL_CONFERENCE + "getAllAvailabeAuthors");

    const response = await request.json();
    setAuthors(response);
    console.log("authors", response);
    setActiveLoader(false);
  };

  const getBarStackData = async () => {
    if (selectedAuthor.length == 0 || selectedConferences.length == 0) {
      console.log("getBarStackData  returened");
      return;
    }
    console.log("author selected: ", selectedAuthor);
    console.log("conferences selected: ", selectedConferences);
    setActiveButton(true);
    setActiveLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "compareAuthorsBasedPublicationCount/" +
        selectedAuthor.join("&") +
        "/" +
        selectedConferences.join("&")
    );

    const response = await request.json();
    console.log("responseLL : ", response[0].categories);
    console.log("responseLL : ", response);
    setStackedBarData({
      options: {
        chart: {
          stacked: true,
        },
        title: {
          text: `Number of publication published ${selectedConferences.join(
            " and "
          )}`,
          align: "center",
        },
        height: 200,
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        xaxis: {
          categories: response[0].categories,
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "Publications";
            },
          },
        },
        fill: {
          opacity: 1,
        },
      },
      series: response[0].series,
    });
    console.log("authors", response);
    setActiveLoader(false);
  };
  const getAllAvailbelConfs = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAllAvailableConferences/"
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

  const getSharedPublicationsCount = async () => {
    if (selectedAuthor.length == 0 || selectedConferences.length == 0) {
      console.log("getSharedPublicationsCount reterned ");
      return;
    }
    try {
      const request = await fetch(
        BASE_URL_CONFERENCE +
          "sharedPublicationBetweenAuthors/" +
          selectedAuthor.join("&") +
          "/" +
          selectedConferences.join("&")
      );
      if (request) {
        const json = await request.json();
        if (json) {
          console.log("response : ", json);
          SetSets(json.sets);
          setListContent(json.names);
          setShowWarning(false);
          setShowSimilarityWarning(false);
        }
      }
    } catch (error) {
      console.log(
        "error happened during fetching the shared publications count:",
        error
      );
    }
  };
  const handleCompare = () => {
    setCompareClicked(true);
    getBarStackData();
    getSharedPublicationsCount();
  };
  const handleCloseDiaglog = () => {
    setOpenDialog(false);
  };
  const handleGetPublications = async (publication) => {
    console.log("publication", publication);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationByTitle/" + publication
    );
    const response = await request.json();

    setPublicationList(response.publicationList);
    console.log("responpes: ", response);
    setOpenDialog(true);
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
          Comparing Authors' Publication Contributions Across Multiple
          Conferences
        </Typography>
        <Grid container xs={12}>
          <Typography variant="h6">
            This stacked bar chart shows a comparative analysis of multiple
            authors' publication counts across selected conferences
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
      <Grid item xs={12} style={{ marginTop: "1%" }}>
        <Paper
          sx={{
            width: "100%",
            padding: "1%",
            borderRadius: "40px",
          }}
        >
          <ActiveLoader
            marginLeft="35%"
            height={50}
            width={50}
            visible={loader}
          />
          <StackedBarChart DataProps={stackedBarData} loader={false} />
        </Paper>
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
        <Grid container xs={12} marginBottom="1%">
          <Typography variant="h6">
            The Venn diagram shows the collaborative contributions{" "}
            {compareClicked && selectedAuthorsNames.length > 0 && (
              <>
                by {selectedAuthorsNames.join(" and ")} at the{" "}
                <b>{selectedConferences.join(" and ")} conferences</b>
              </>
            )}
          </Typography>
        </Grid>
        <Grid>
          {sets.length > 0 && listContent.length > 0 && (
            <InteractiveVennDiagram
              sets={sets}
              listContent={listContent}
              label={"publication"}
              handleGetPublications={handleGetPublications}
            />
          )}
        </Grid>
        {publicationList && publicationList.length > 0 && (
          <PublicationDialog
            openDialogProps={openDialog}
            papersProps={publicationList}
            handleCloseDiaglog={handleCloseDiaglog}
            originalKeywordsProps={[selectedWord]}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default CompareAuthorsStackedBarChart;
