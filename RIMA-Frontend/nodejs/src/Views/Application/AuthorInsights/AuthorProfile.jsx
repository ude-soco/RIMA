import {
  Grid,
  List,
  ListSubheader,
  InputAdornment,
  TextField,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BASE_URL_CONFERENCE } from "Services/constants";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NodeLinkDiagram from "./NodeLinkDiagraom";
const AuthorProfile = () => {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  let [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    getAllAuthorsDB();
  }, []);
  useEffect(() => {
    handleGenerateGraph();
  }, [selectedAuthor]);

  const getAllAuthorsDB = async () => {
    const request = await fetch(BASE_URL_CONFERENCE + "getAllAvailabeAuthors");
    const response = await request.json();
    setAuthors(response);
    console.log("authors", response);
  };

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
        console.log(" result: ", result.data);
      }
    } catch (error) {
      console.log("Error fetching network date", error);
    }
  };

  return (
    <Grid container>
      <Grid container>
        <Grid item xs={11}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={authors}
            renderInput={(params) => <TextField {...params} label="Author" />}
            sx={{ width: "100%" }}
            onChange={(event, newInputValue) => {
              if (newInputValue) {
                setSelectedAuthor(newInputValue);
              }
            }}
          />
        </Grid>
        <Grid item>
          <PersonSearchIcon color="primary" sx={{ fontSize: 50 }} />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "1%" }}>
        <NodeLinkDiagram networkDataProp={networkData} />
      </Grid>
    </Grid>
  );
};
export default AuthorProfile;
