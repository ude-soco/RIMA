import { Box, Paper } from "@material-ui/core";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import RIMAButton from "../ReuseableComponents/RIMAButton";
import { useEffect } from "react";
import { BASE_URL_CONFERENCE } from "Services/constants";

const SearchBarFilterOption = ({
  MostPublisehd,
  handleSelectedConferences,
}) => {
  const [conferences, setConferences] = useState([
    { name: "lak", label: "lak" },
    { name: "Edm", label: "Edm" },
    { name: "Aied", label: "Aied" },
    { name: "All Conferences", label: "All Conferences" },

    "All Conferences",
  ]);
  const [event, setEvents] = useState([
    { name: "lak2011", label: "lak2011" },
    { name: "EDM2012", label: "EDM2012" },
    { name: "aied2011", label: "aied2011" },
    { name: "All Events", label: "All Events" },
  ]);
  const [selectedEvents, setSelectedEvets] = useState(
    conferences[conferences.length - 1]
  );
  const [selectedConferences, setSelectedConferences] = useState([
    { name: "All Conferences", label: "All Conferences" },
  ]);
  useEffect(() => {
    getAllAvailbelConfs();
    getAllAvailabelEvents();
  }, []);

  const getAllAvailabelEvents = async () => {
    const request = await fetch(BASE_URL_CONFERENCE + "getAllAvailableEvents/");
    const response = await request.json();
    setEvents(response);
  };

  const getAllAvailbelConfs = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAllAvailableConferences/"
    );
    const response = await request.json();
    setConferences(response);
  };
  return (
    <Box
      style={{ backgroundColor: "#f7fafc" }}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={5}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={5}>
          <Paper style={{ padding: "2%" }}>
          <Typography variant="h6">Published in:</Typography>
            <Autocomplete
              id="tags-standard"
              options={conferences}
              multiple
              defaultValue={selectedConferences}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Conference" variant="standard" />
              )}
              onChange={(event, newInputValue) => {
                if (newInputValue) {
                  handleSelectedConferences(newInputValue);
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper
            style={{ padding: "1%", marginLeft: "20%", marginBottom: "2%" }}
          >
            <FormGroup>
              <Typography variant="h6">Sorted By:</Typography>
              <FormControlLabel
                onChange={(e) => MostPublisehd(e.target.checked)}
                control={<Checkbox defaultChecked />}
                label="Most Published Authors"
              />
            </FormGroup>
          </Paper>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        sx={{
          marginTop: "2%",
        }}
      ></Grid>
    </Box>
  );
};
export default SearchBarFilterOption;
