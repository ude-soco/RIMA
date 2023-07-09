import {
  Grid,
  List,
  ListSubheader,
  InputAdornment,
  TextField,
  Autocomplete,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BASE_URL_CONFERENCE } from "Services/constants";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NodeLinkDiagram from "./NodeLinkDiagraom";
import AuthorDetails from "./AuthorDetails";
import AuthorOverview from "./AuthorOverview";
const AuthorProfile = () => {
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  let [networkData, setNetworkData] = useState([]);
  const [authorData, setAuthorData] = useState(null);

  useEffect(() => {
    getAllAuthorsDB();
  }, []);
  useEffect(() => {
    handleGenerateGraph();
    handleAuhtorData();
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
  const handleAuhtorData = async () => {
    try {
      console.log("selected Author: ", selectedAuthor);
      if (selectedAuthor !== "") {
        setAuthorData([]);
        const response = await fetch(
          BASE_URL_CONFERENCE + "getAuthorDetails/" + selectedAuthor.label
        );
        const result = await response.json();
        setAuthorData(result.data);
      }
    } catch (error) {
      console.log("Error fetching Author date", error);
    }
  };

  return (
    <Grid container>
      <Paper
        elevation={6}
        sx={{ margin: "20px", boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
        style={{
          padding: "20px",
          width: "100%",
        }}
      >
        <Grid container xs={12} spacing={2}>
          <Grid item xs={10}>
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
          <Grid item xs={2}>
            <PersonSearchIcon color="primary" sx={{ fontSize: 50 }} />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ width: "100%", margin: "20px" }}>
        <Grid
          container
          justify="center"
          alignItems="flex-start"
          columnSpacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{ width: "100%" }}
        >
          <Grid item xs={12} lg={5} sx={{ margin: "20px" }}>
            {authorData && <AuthorDetails authorDataProp={authorData} />}
          </Grid>
          <Grid item xs={12} lg={6}>
            {authorData && (
              <AuthorOverview authorNameProps={selectedAuthor.label}
                />
            )}
          </Grid>
        </Grid>
      </Paper>

      <Grid item xs={12}>
        <NodeLinkDiagram networkDataProp={networkData} />
      </Grid>
    </Grid>
  );
};
export default AuthorProfile;
