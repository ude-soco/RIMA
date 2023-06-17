import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import VennModule from "highcharts/modules/venn.js";
import HighchartsReact from "highcharts-react-official";
import {
  List,
  TextField,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import InfoBox from "../../Application/ReuseableComponents/InfoBox";

VennModule(Highcharts);
const SharedAuthorVennDiagram = () => {
  const [selectedEvent, setSelectedEvent] = useState([]);

  const lak2011_authors = [
    "author1",
    "author2",
    "author3",
    "author4",
    "author5",
    "author6",
    "author7",
    "author8",
    "author9",
    "author10",
  ];
  const lak2015_authors = [
    "author6",
    "author7",
    "author8",
    "author9",
    "author10",
    "author11",
    "author12",
    "author13",
    "author14",
    "author15",
    "author16",
    "author17",
    "author18",
    "author19",
    "author20",
  ];
  const lak2021_authors = [
    "author11",
    "author12",
    "author13",
    "author21",
    "author22",
    "author23",
    "author24",
    "author25",
    "author26",
    "author27",
    "author28",
    "author29",
    "author30",
  ];

  const getIntersection = (arrs) => {
    return arrs.reduce((a, b) => a.filter((c) => b.includes(c)));
  };
  const [selectedSet, setSelectedSet] = useState("lak2011");

  const sets = [
    { sets: ["lak2011"], value: 10, name: "lak2011" },
    { sets: ["lak2015"], value: 20, name: "lak2015" },
    { sets: ["lak2021"], value: 20, name: "lak2021" },
    { sets: ["lak2011", "lak2015"], value: 5, name: "lak2011_lak2015" },
    { sets: ["lak2011", "lak2021"], value: 5, name: "lak2011_lak2021" },
    { sets: ["lak2015", "lak2021"], value: 10, name: "lak2015_lak2021" },
    {
      sets: ["lak2011", "lak2015", "lak2021"],
      value: 5,
      name: "lak2011_lak2015_lak2021",
    },
  ];
  const vennOptions = {
    title: {
      text: "Shared Authors",
    },
    chart: {
      backgroundColor: "#ffffff",
      borderWidth: 2,
      borderColor: "#fff",
      borderRadius: 20,
      className: "",
      animation: true,
    },
    tooltip: {
      formatter: function () {
        if (this.point.sets.length === 1) {
          return (
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> Total number of authors in ' +
            this.point.name +
            ": " +
            this.point.value +
            "<br>Click to get authors' list"
          );
        } else {
          return (
            '<span style="color:' +
            this.point.color +
            '">\u25CF</span> Shared number of authors between ' +
            this.point.name +
            ": " +
            this.point.value +
            "<br>Click to get authors' list"
          );
        }
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            if (this.point.sets.length === 1) {
              return this.point.name;
            }
            return null;
          },
        },
      },
    },
    series: [
      {
        type: "venn",
        name: "Shared authors",
        data: sets,
        point: {
          events: {
            click: function () {
              const clickedSets = this.sets;

              let authorsSets = [];
              if (clickedSets.includes("lak2011")) {
                authorsSets.push(lak2011_authors);
                setSelectedSet("lak2011");
              }
              if (clickedSets.includes("lak2015")) {
                authorsSets.push(lak2015_authors);
                setSelectedSet("lak2015");
              }
              if (clickedSets.includes("lak2021")) {
                authorsSets.push(lak2021_authors);
                setSelectedSet("lak2021");
              }

              const selectedAuthors = getIntersection(authorsSets);
              setSelectedEvent(selectedAuthors);
            },
          },
        },
      },
    ],
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);

  useEffect(() => {
    setSelectedEvent(
      selectedEvent.filter((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);
  return (
    <Grid container={12} spacing={2}>
      <Grid item xs={8}>
        <HighchartsReact highcharts={Highcharts} options={vennOptions} />
      </Grid>
      <Grid item xs={4}>
        <Grid container xs={12}>
          <Grid item xs={10}>
            <Typography style={{ marginTop: "1%" }} variant="h6">
              list of authors in {selectedSet}
            </Typography>
          </Grid>
          <Grid item xs={2} justify="center" alignItems="center">
            <i
              className="fas fa-question-circle text-blue"
              onMouseOver={() => setImageTooltipOpen(true)}
              onMouseOut={() => setImageTooltipOpen(false)}
            >
              {imageTooltipOpen && (
                <InfoBox
                  marginLeft={"50%"}
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  Info={`Enter the author's name to check if they're in the list.`}
                />
              )}
            </i>
          </Grid>
        </Grid>
        <TextField
          label="search-authors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <Paper style={{ maxHeight: "30vh", overflow: "scroll" }}>
          <List>
            {selectedEvent &&
              selectedEvent.map((author) => (
                <ListItem button>
                  <ListItemText primary={author}></ListItemText>{" "}
                </ListItem>
              ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SharedAuthorVennDiagram;
