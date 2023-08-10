// updated by Islam Abdelghaffar
import {
  IconButton,
  Tooltip,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import PublicationDialog from "../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog";
import FilterButton from "./FilterButton";
import StackedBarChart from "./stackedBarchart";
import InfoBox from "../ReuseableComponents/InfoBox";

const AuthorOverview = ({ authorNameProps }) => {
  const [publicationList, setPublicationList] = useState([]);
  const [eventsName, setEventsName] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  const [selectedYear, setSelectedEvent] = useState("");
  const [loader, setLoader] = useState(false);

  const [filteredConfsName, setFilteredConfsName] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);

  const [optionChecked, setOptionChecked] = useState(
    Array(filterOptions.length).fill(true)
  );
  const plotOptions = {
    bar: {
      horizontal: false,
      dataLabels: { position: "top" },
      columnWidth: "70%",
      barGap: "0%",
      distributed: false,
    },
  };

  const [stackedBarData, setStackedBarData] = useState({
    options: {
      chart: {
        stacked: true,
        events: {
          dataPointSelection: function (event, chartContext, config) {
            const selectedYear = config.w.globals.labels[config.dataPointIndex];

            setSelectedEvent(selectedYear);
          },
        },
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
            return val + "Publications";
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
  const [OrigionalStackedBarData, setOrigionalStackedBarData] = useState({
    chart: {
      stroke: {
        stacked: true,
      },
      type: "bar",
      height: 200,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedYear = config.w.globals.labels[config.dataPointIndex];
          console.log("selectedYear", selectedYear);
          setSelectedEvent(selectedYear);
        },
      },
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Publications ${" "}
           Click to get relevant publications`;
        },
      },
    },
    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });
  useEffect(() => {
    getAuthorPublicationCount();
  }, [authorNameProps]);

  useEffect(() => {
    if (selectedYear !== " ") {
      getPublicationListBasedOnEventName();
    }
  }, [selectedYear]);

  const getSelectedEvents = () => {
    let selectedIndex = [];
    optionChecked.forEach((option, index) => {
      if (option) {
        selectedIndex.push(index);
      }
    });
    return selectedIndex;
  };
  const handleCloseDiaglog = () => {
    setOpenDiaglog(false);
  };
  const handleToggle = (index) => {
    console.log("optionChecked", optionChecked);
    const newOptionChecked = [...optionChecked];
    newOptionChecked[index] = !newOptionChecked[index];
    setOptionChecked(newOptionChecked);
  };
  const handleOnSaveCliced = () => {
    getAuthorPublicationCountBasedOnFilter();
  };
  const getAuthorPublicationCount = async () => {
    setLoader(true);
    setFilterOptions([]);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getAuthorPublicationCountOverYears/" +
        authorNameProps.label
    );

    const response = await request.json();
    console.log("response: ", response);
    setStackedBarData({
      options: {
        chart: {
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const selectedYear =
                config.w.globals.labels[config.dataPointIndex];
              const selectedSeriesName =
                response.series[config.seriesIndex].name;
              console.log("selectedYear", selectedYear);
              console.log("selectedSeriesName", selectedSeriesName);
              setSelectedEvent(selectedSeriesName + selectedYear);
            },
          },
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
          categories: response.categories,
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} Publications ${" "}
               Click to get relevant publications`;
            },
          },
        },
        fill: {
          opacity: 1,
        },
      },
      series: response.series,
    });

    setOrigionalStackedBarData({
      options: {
        chart: {
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const selectedYear =
                config.w.globals.labels[config.dataPointIndex];
              const selectedSeriesName =
                response.series[config.seriesIndex].name;
              console.log("selectedYear", selectedYear);
              console.log("selectedSeriesName", selectedSeriesName);
              setSelectedEvent(selectedYear);
            },
          },
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
          categories: response.categories,
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} Publications ${" "}
               Click to get relevant publications`;
            },
          },
        },
        fill: {
          opacity: 1,
        },
      },
      series: response.series,
    });
    setFilterOptions(response.conferences);
    setFilteredConfsName(response.conferences);
    setLoader(false);
  };
  // done
  const getAuthorPublicationCountBasedOnFilter = async () => {
    setLoader(true);
    let selectedIndex = getSelectedEvents();
    if (selectedIndex.length == 0) {
      setStackedBarData(OrigionalStackedBarData);
      setFilteredConfsName(filterOptions);
      setLoader(false);
      return;
    }
    let filteredConfs = selectedIndex.map((index) => filterOptions[index]);

    console.log("years: ", filteredConfs);
    setFilteredConfsName(filteredConfs);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getAuthorPublicationCountBasedConfs/" +
        authorNameProps.label +
        "/" +
        filteredConfs.join("&")
    );
    const response = await request.json();

    setStackedBarData({
      options: {
        chart: {
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const selectedYear =
                config.w.globals.labels[config.dataPointIndex];
              const selectedSeriesName =
                response.series[config.seriesIndex].name;
              console.log(
                "selectedSeriesName",
                selectedSeriesName + selectedYear
              );
              setSelectedEvent(selectedSeriesName + selectedYear);
            },
          },
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
          categories: response.categories,
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} Publications ${" "}
               Click to get relevant publications`;
            },
          },
        },
        fill: {
          opacity: 1,
        },
      },
      series: response.series,
    });

    setFilteredConfsName(response.conferences);
    setLoader(false);
  };

  // get pubs in specific events
  const getPublicationListBasedOnEventName = async () => {
    console.log("eventsName: ", eventsName);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getPublicationListBasedOnEventName/" +
        authorNameProps.label +
        "/" +
        selectedYear
    );
    setSelectedEvent(" ");
    const response = await request.json();
    setOpenDiaglog(true);
    setPublicationList(response["publicationList"]);
  };

  return (
    <Grid>
      <Grid
        container
        xs={12}
        style={{
          padding: "2%",
          margin: "1%",
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
            {authorNameProps.name}'s Yearly Publication Distribution Across
            Conferences
          </Typography>
          <Grid container xs={12}>
            <Grid item xs={11}>
              <Typography variant="h6">
                The stacked bar chart visualizes the distribution of{" "}
                <b>{authorNameProps.name}'s publications </b> across different
                conferences including <b>( {filteredConfsName.join(", ")}) </b>
                on a year-by-year basis.
              </Typography>
            </Grid>
            <Grid item justify="center" alignItems="center">
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => setImageTooltipOpen(true)}
                onMouseOut={() => setImageTooltipOpen(false)}
              >
                {imageTooltipOpen && (
                  <InfoBox
                    marginLeft={"50%"}
                    style={{
                      transform: "translateX(-50%)",
                    }}
                    Info={` By clicking on any segment, detailed information about the specific
                  publications published in that conference in that year will be shown`}
                  />
                )}
              </i>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "1%" }}>
          <Paper
            sx={{
              width: "100%",
              padding: "1%",
              borderRadius: "40px",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                marginLeft: "90%",
              }}
            >
              <Tooltip title="Filter" placement="top">
                <IconButton aria-label="filter">
                  <FilterButton
                    optionsProps={filterOptions}
                    handleToggleProps={handleToggle}
                    checkedProps={optionChecked}
                    onSaveClickedProps={handleOnSaveCliced}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
            <StackedBarChart DataProps={stackedBarData} loader={loader} />
          </Paper>
        </Grid>
      </Grid>

      {publicationList && publicationList.length > 0 && (
        <PublicationDialog
          openDialogProps={openDialog}
          papersProps={publicationList}
          handleCloseDiaglog={handleCloseDiaglog}
        />
      )}
    </Grid>
  );
};
export default AuthorOverview;
