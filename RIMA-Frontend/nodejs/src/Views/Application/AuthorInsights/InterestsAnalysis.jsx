import { Grid, Paper, Typography, Select, MenuItem, Box } from "@mui/material";
import { BASE_URL_CONFERENCE } from "Services/constants";
import React, { useState } from "react";
import { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import InfoBox from "../ReuseableComponents/InfoBox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PublicationDialog from "../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

const InterestsAnalysis = ({ authorProp, allAvailableConfProps }) => {
  const [minCount, setMinCount] = useState(1);
  const [publicationList, setPublicationList] = useState([]);
  const [authorConfs, setAuthorConfs] = useState([]);
  const [option, setOption] = useState({
    options: {
      chart: {
        type: "bar",
        stacked: true,
      },
      xaxis: {
        categories: ["2011", "2012", "2013"],
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      legend: {
        position: "right",
      },
      tooltip: {
        y: {
          title: {
            formatter: function () {
              return "Click to get relevant publications";
            },
          },
        },
      },
    },
  });
  const [series, setSeries] = useState([
    {
      name: "keyword1",
      data: [3, 2, 1],
    },
    {
      name: "keyword2",
      data: [1, 0, 2],
    },
    {
      name: "keyword3",
      data: [0, 1, 0],
    },
  ]);
  const [chartKey, setChartKey] = useState(Date.now());

  const [openDialog, setOpenDialog] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedSegmentWord, setSelectedSegmentWord] = useState("");
  const [selectedSegmentWorYear, setSelectedSegmentWordYear] = useState("");
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [authorProp]);
  useEffect(() => {
    if (selectedSegmentWord !== "" && selectedSegmentWorYear !== "")
      getWordPublication();
  }, [selectedSegmentWord, selectedSegmentWorYear]);

  useEffect(() => {
    if (fetchedData !== null) {
      updateChartData(fetchedData);
    }
  }, [minCount]);

  const handleCountChange = (e) => {
    setMinCount(parseInt(e.target.value));
  };
  const getData = async () => {
    setShowWarning(false);
    setLoader(true);
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorInterestes/" + authorProp.label
    );
    const response = await request.json();
    let opt = {
      options: {
        chart: {
          type: "bar",
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const word = config.w.globals.labels[config.dataPointIndex];
              const wordYear =
                response.interests.series[config.seriesIndex].name;
              console.log("selected Segment", word);
              console.log("Segment", wordYear);

              setSelectedSegmentWord(word);
              setSelectedSegmentWordYear(wordYear);
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        xaxis: {
          categories: response.interests.categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        legend: {
          position: "right",
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} 
               Click to get relevant publications`;
            },
          },
        },
      },
    };
    if (response.interests.categories.length == 0) {
      setShowWarning(true);
    }
    setOption(opt);
    let seriesWithOriginalIndex = response.interests.series.map(
      (item, index) => ({
        ...item,
        originalIndex: index,
      })
    );
    setSeries(seriesWithOriginalIndex);
    setLoader(false);
    setFetchedData(response.interests);
    setChartKey(Date.now());
    setAuthorConfs(response.confs);
  };

  const updateChartData = (data) => {
    setLoader(true);
    let filteredSeries = data.series
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter((item) => {
        let count = item.data.reduce(
          (total, val) => total + (val > 0 ? 1 : 0),
          0
        );
        return count >= minCount;
      });

    let opt = {
      options: {
        chart: {
          type: "bar",
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const word = config.w.globals.labels[config.dataPointIndex];
              const wordYear = filteredSeries[config.seriesIndex].name;
              console.log("selected word after filter: ", word);
              console.log("selected year after filter:", wordYear);

              setSelectedSegmentWord(word);
              setSelectedSegmentWordYear(wordYear);
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        xaxis: {
          categories: data.categories,
        },
        yaxis: {
          title: {
            text: "Count",
          },
        },
        legend: {
          position: "right",
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${val} 
               Click to get relevant publications`;
            },
          },
        },
      },
    };

    setOption(opt);
    setSeries(filteredSeries);
    setLoader(false);
    setChartKey(Date.now());
  };
  const handleCloseDiaglog = () => {
    setOpenDialog(false);
    setSelectedSegmentWord("");
    setSelectedSegmentWordYear("");
  };
  const getWordPublication = async () => {
    console.log(" selectedSegmentWord:  ", selectedSegmentWord);
    console.log(" selectedSegmentWorYear:  ", selectedSegmentWorYear);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getWordPublicationByYearAndAuthor" +
        "/" +
        authorProp.label +
        "/" +
        selectedSegmentWorYear +
        "/" +
        selectedSegmentWord
    );
    const response = await request.json();
    setPublicationList(response.publicationList);
    setOpenDialog(true);
  };
  return (
    <Grid
      container
      alignContent="center"
      alignItems="center"
      style={{
        padding: "2%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Grid container xs={12} marginBottom={"6%"}>
        <Grid item xs={12} marginBottom={"1%"}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            {authorProp.name} Interests Over Time
          </Typography>
        </Grid>
        <Grid container xs={12}>
          <Grid item xs={12}>
            <Typography variant="h6">
              This stacked bar chart represents the frequency of{" "}
              <b>{authorProp.name}'s topics across different years</b>. The
              topics have been extracted from the publications published in{" "}
              <b>({authorConfs.join(",")})</b> Each bar in the chart
              corresponds to a year, and each segment of a bar represents a
              topic. The size of the segment reflects the number of publications
              released by the
              {authorProp.name} that mentioned the respective topic within that
              year.
            </Typography>
            {showWarning && (
              <Typography
                style={{ fontWeight: "bold", color: "#BC211D" }}
                variant="h6"
                gutterBottom
              >
                {" "}
                No topics available for this author
              </Typography>
            )}
            <Grid item justify="center" alignItems="center">
              <i
                className="fas fa-question-circle text-blue"
                onMouseOver={() => setImageTooltipOpen(true)}
                onMouseOut={() => setImageTooltipOpen(false)}
              >
                {imageTooltipOpen && (
                  <InfoBox
                    marginLeft={"10%"}
                    style={{
                      transform: "translateX(-50%)",
                    }}
                    Info={`Use the 'Minimum number of occurrence' dropdown to filter Interests
                     that appear in at least a certain number of years.
                     For example, selecting '2' will only display Interests that
                     appear in two or more years. This feature helps to highlight
                     the most persistent interests of the author over time.`}
                  />
                )}
              </i>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4} marginBottom="2%" borderRadius="40px">
        <Box sx={{ minWidth: "100%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Minimum number of occurrence
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={minCount}
              label="Minimum number of occurrence"
              onChange={handleCountChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <ActiveLoader
        marginLeft={"35%"}
        height={80}
        width={80}
        visible={loader}
      />
      <Grid item xs={12}>
        <Paper style={{ borderRadius: "40px", padding: "2%" }}>
          <ReactApexChart
            key={chartKey}
            options={option.options}
            series={series}
            type="bar"
            height={400}
          />
        </Paper>
      </Grid>
      {publicationList && publicationList.length > 0 && (
        <PublicationDialog
          openDialogProps={openDialog}
          papersProps={publicationList}
          handleCloseDiaglog={handleCloseDiaglog}
          originalKeywordsProps={[selectedSegmentWord]}
        />
      )}
    </Grid>
  );
};
export default InterestsAnalysis;
