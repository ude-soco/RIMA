import {
  Select,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import InteractiveVennDiagram from "./InteractiveVennDiagram";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import { BASE_URL_CONFERENCE } from "Services/constants";

const SharedTopicsVennDiagram = ({
  conferenceName,
  confEvents,
  conferences,
}) => {
  const [sets, SetSets] = useState([
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
  ]);

  const [firstSelectedEvent, setFirstSelectEvent] = useState("");
  const [secondSelectedEvent, setSecondSelectEvent] = useState("");
  const [thirdSelectedEvent, setthirdSelectEvent] = useState("");
  const [buttonActive, setButtonActive] = useState(false);
  const handleCompare = async () => {
    setButtonActive(true);
    const request = await fetch(
      BASE_URL_CONFERENCE +
        "sharedTopicsBetweenEvents/" +
        firstSelectedEvent +
        "&" +
        secondSelectedEvent +
        "&" +
        thirdSelectedEvent
    );
    const response = await request.json();
  };
  console.log("events", confEvents);
  return (
    <Grid container xs={12}>
      <Grid container xs={12}>
        <Grid item xs={12}>
          Shared Topics between events
        </Grid>
        <Grid item xs={12}>
          the venn diagram shows shared topic between selected events within
          selected conference
        </Grid>
        <Grid container style={{ paddingTop: "3%" }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl sx={{ m: 1, minWidth: 250, backgroundColor: "white" }}>
              <InputLabel>First Event*</InputLabel>
              <Select
                labelId="First Event"
                value={firstSelectedEvent}
                onChange={(e) => setFirstSelectEvent(e.target.value)}
              >
                {confEvents.map((event) => {
                  return <MenuItem value={event.label}>{event.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl sx={{ m: 1, minWidth: 250, backgroundColor: "white" }}>
              <InputLabel>Second Event*</InputLabel>

              <Select
                labelId="Second Event"
                value={secondSelectedEvent}
                onChange={(e) => setSecondSelectEvent(e.target.value)}
              >
                {confEvents.map((event) => {
                  return <MenuItem value={event.label}>{event.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl sx={{ m: 1, minWidth: 250, backgroundColor: "white" }}>
              <InputLabel>Third Event (Optional)</InputLabel>
              <Select
                labelId="Third Event"
                value={thirdSelectedEvent}
                onChange={(e) => setthirdSelectEvent(e.target.value)}
              >
                {confEvents.map((event) => {
                  return <MenuItem value={event.label}>{event.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: "3%", paddingLeft: "1%" }}>
            <RIMAButton
              name="Compare"
              onClick={handleCompare}
              activeButton={buttonActive}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} style={{ paddingTop: "3%" }}>
        <Paper
          style={{ width: "100%", borderRadius: "40px", padding: "1%" }}
          elevation={10}
        >
          <InteractiveVennDiagram
            sets={sets}
            listContent={[]}
            label={"topics"}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
export default SharedTopicsVennDiagram;
