import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import GroupBarChart from "../ReuseableComponents/GroupBarChart";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";
import PublicationDialog from "../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog";
import FilterButton from "./FilterButton";

const AuthorOverview = ({ authorNameProps }) => {
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [loader, setLoader] = useState(false);
  const [series, setSeries] = useState([
    {
      data: [1, 0, 0, 0, 3, 2, 0, 0, 0, 0],
    },
  ]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [OrigionalOption, setOrigionalOption] = useState({
    chart: {
      stroke: {
        curve: "smooth",
      },
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedYear = config.w.globals.labels[config.dataPointIndex];
          console.log("selectedYear", selectedYear);
          setSelectedYear(selectedYear);
        },
      },
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });
  const [OrigionalSeries, setOrigionalSeries] = useState([
    {
      data: [1, 0, 0, 0, 3, 2, 0, 0, 0, 0],
    },
  ]);
  const [optionChecked, setOptionChecked] = useState(
    Array(filterOptions.length).fill(false)
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
  const [options, setOptions] = useState({
    chart: {
      stroke: {
        curve: "smooth",
      },
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const selectedYear = config.w.globals.labels[config.dataPointIndex];
          console.log("selectedYear", selectedYear);
          setSelectedYear(selectedYear);
        },
      },
    },
    plotOptions: plotOptions,
    dataLabels: { enabled: true },

    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2020],
    },
  });

  useEffect(() => {
    console.log("authorNameProps: ", authorNameProps);
    getAuthorPublicationCount();
  }, [authorNameProps]);

  useEffect(() => {
    console.log("authorNameProps: ", authorNameProps);
    getAuthorPublicationCount();
  }, []);
  const getAuthorPublicationCount = async () => {
    setLoader(true);
    setFilterOptions([]);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getAuthorPublicationCountOverYears/" +
        authorNameProps
    );
    const response = await request.json();
    console.log("request count", { data: response.count });
    console.log("request years", response.years);
    setSeries([
      {
        data: response.count,
      },
    ]);
    setOrigionalSeries([
      {
        data: response.count,
      },
    ]);
    setOptions({
      chart: { type: "bar", height: 350 },
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { position: "top" },
          borderRadius: 4,
          columnWidth: "75%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontWeight: 700,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c49c94",
      ],
      xaxis: {
        categories: response.years,
      },
    });
    setOrigionalOption({
      chart: { type: "bar", height: 350 },
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { position: "top" },
          borderRadius: 4,
          columnWidth: "75%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontWeight: 700,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c49c94",
      ],
      xaxis: {
        categories: response.years,
      },
    });
    setFilterOptions(response.conferences);
    setLoader(false);
  };

  useEffect(() => {
    getAuthorPublicationList();
  }, [selectedYear, authorNameProps]);

  const getAuthorPublicationList = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getAuthorPublicatinListInYear/" +
        authorNameProps +
        "/" +
        selectedYear
    );
    const response = await request.json();
    console.log("response: ", response);
    setOpenDiaglog(true);
    setPublicationList(response["publicationList"]);
  };
  const getPublicationListBasedOnFilter = async () => {
    setLoader(true);
    let selectedIndex = [];
    optionChecked.forEach((option, index) => {
      if (option) {
        selectedIndex.push(index);
      }
    });
    if (selectedIndex.length == 0) {
      setOptions(OrigionalOption);
      setSeries(OrigionalSeries);
      setLoader(false);
      return;
    }
    let final = selectedIndex.map((index) => filterOptions[index]);

    console.log("final", final);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getPublicationListBasedOnFilter/" +
        authorNameProps +
        "/" +
        final.join("&")
    );
    const response = await request.json();
    console.log("request count", { data: response.count });
    console.log("request years", response.years);
    setSeries([
      {
        data: response.count,
      },
    ]);
    setOptions({
      chart: { type: "bar", height: 350 },
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: { position: "top" },
          borderRadius: 4,
          columnWidth: "75%",
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      yaxis: {
        forceNiceScale: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            fontWeight: 700,
          },
        },
      },
      fill: {
        opacity: 1,
      },
      colors: [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
        "#7f7f7f",
        "#bcbd22",
        "#17becf",
        "#aec7e8",
        "#ffbb78",
        "#98df8a",
        "#ff9896",
        "#c5b0d5",
        "#c49c94",
      ],
      xaxis: {
        categories: response.years,
      },
    });
    setLoader(false);
  };
  const handleCloseDiaglog = () => {
    setOpenDiaglog(false);
  };
  const handleToggle = (index) => {
    const newOptionChecked = [...optionChecked];
    newOptionChecked[index] = !newOptionChecked[index];
    setOptionChecked(newOptionChecked);
  };
  const handleOnSaveCliced = () => {
    console.log("save clicked", optionChecked);

    getPublicationListBasedOnFilter();
  };
  return (
    <Grid>
      <Grid container>
        <Grid container xs={12}>
          <Grid item xs={10}>
            <Typography variant="h4" style={{ padding: "16px" }}>
              {authorNameProps}' publications
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Filter" placement="right-end">
              <IconButton aria-label="filter">
                <FilterButton
                  optionsProps={filterOptions}
                  handleToggleProps={handleToggle}
                  checkedProps={() => optionChecked}
                  onSaveClickedProps={handleOnSaveCliced}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <GroupBarChart options={options} series={series} loader={loader} />
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
