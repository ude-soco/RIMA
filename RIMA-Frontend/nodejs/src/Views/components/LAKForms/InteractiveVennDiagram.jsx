// created by Islam Abdelghaffar
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Tooltip,
} from "@material-ui/core";
import InfoBox from "../../Application/ReuseableComponents/InfoBox";
import { IconButton, ListItemSecondaryAction } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
VennModule(Highcharts);
const InteractiveVennDiagram = ({
  sets,
  listContent,
  label,
  handleGetPublications,
}) => {
  const [selectedEventOriginal, setSelectedEventOriginal] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(selectedEventOriginal);
  const [selectedSet, setSelectedSet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);

  const listContentRef = useRef(listContent);

  useEffect(() => {
    setSelectedEvent(selectedEventOriginal);
  }, [selectedEventOriginal]);

  useEffect(() => {
    listContentRef.current = listContent;
  }, [listContent]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSelectedEvent(selectedEventOriginal);
    } else {
      setSelectedEvent(
        selectedEvent.filter((author) =>
          author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  const vennOptions = {
    title: {
      text: `Shared ${label}s`,
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
            `">\u25CF</span> Total number of ${label}s in ` +
            this.point.name +
            ": " +
            this.point.value +
            `<br>Click to get ${label} list`
          );
        } else {
          return (
            '<span style="color:' +
            this.point.color +
            `">\u25CF</span> Shared number of ${label}s between ` +
            this.point.name +
            ": " +
            this.point.value +
            `<br>Click to get ${label} list`
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
              return this.point.name + "<br>" + this.point.value;
            }
            return this.point.value;
          },
        },
      },
    },
    series: [
      {
        type: "venn",
        name: `Shared ${label}s`,
        data: sets,
        point: {
          events: {
            click: function () {
              const clickedSets = this.sets;
              clickedSets.sort();
              let clickedSetesName = clickedSets.join(" and ");
              listContentRef.current.map((set) => {
                if (set.name === clickedSetesName) {
                  console.log("names equal");
                  setSelectedSet(set.name);
                  if (label == "author") {
                    setSelectedEventOriginal(set.authors_names);
                  }
                  if (label == "topic") {
                    setSelectedEventOriginal(set.keywords);
                  }
                }
              });
            },
          },
        },
      },
    ],
  };

  console.log("listContent: ", listContent);

  return (
    <Grid container={12} spacing={2}>
      <Grid item xs={8}>
        <HighchartsReact highcharts={Highcharts} options={vennOptions} />
      </Grid>
      <Grid item xs={4}>
        <Grid container xs={12} md={8}>
          <Grid item>
            <Typography style={{ marginTop: "1%" }} variant="h6">
              list of {label}s in {selectedSet}
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
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  Info={`Enter the ${label}'s name to check if they're in the list.`}
                />
              )}
            </i>
          </Grid>
        </Grid>
        <TextField
          label="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <Paper style={{ maxHeight: "30vh", overflow: "scroll" }}>
          <List>
            {selectedEvent &&
              selectedEvent.map((item) => (
                <ListItem button>
                  <ListItemText primary={item}></ListItemText>{" "}
                  {label == "topic" && (
                    <ListItemSecondaryAction>
                      <Tooltip title="Publications">
                        <IconButton
                          onClick={() =>
                            handleGetPublications(item, selectedSet)
                          }
                        >
                          <ArticleIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InteractiveVennDiagram;
