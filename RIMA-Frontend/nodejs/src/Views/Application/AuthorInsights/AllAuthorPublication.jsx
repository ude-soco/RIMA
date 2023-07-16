import {
  Grid,
  Typography,
  Paper,
  ListItem,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ReactWordcloud from "react-wordcloud";
import List from "@mui/material/List";
import InfoBox from "../ReuseableComponents/InfoBox";
import ActiveLoader from "../ReuseableComponents/ActiveLoader";
import ArticleIcon from "@mui/icons-material/Article";
import { BASE_URL_CONFERENCE } from "Services/constants";
import { useEffect } from "react";
import PublicationWordCloud from "./PublicationWordCloud";
import PublicationDialog from "../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

export default function AllAuthorPublication({
  authorNameProps,
  conferencesProps,
  selectedPublicationProp,
}) {
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [publications, setPublications] = useState([
    { title: "publication 1", id: "1" },
    { title: "publication 2", id: "2" },
    { title: "publication 3", id: "3" },
  ]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const [loader, setLoader] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState({});

  const getSelectedPublication = async (publication) => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getPublicationByID/" + publication.id
    );
    const response = await request.json();

    setPublicationList(response.publicationList);
    console.log("responpes: ", response);
    setOpenDialog(true);
  };

  useEffect(() => {
    getAuthorPublications();
  }, []);

  useEffect(() => {
    getAuthorPublications();
  }, [authorNameProps]);

  const getAuthorPublications = async () => {
    const request = await fetch(
      BASE_URL_CONFERENCE + "getAuthorPublications/" + authorNameProps.label
    );
    const response = await request.json();
    setPublications(response);
    console.log("publications :", response);
  };
  const handleCloseDiaglog = () => {
    setOpenDialog(false);
  };
  return (
    <Grid
      container
      alignContent="center"
      alignItems="center"
      spacing={2}
      style={{
        padding: "2%",
        margin: "1%",
        backgroundColor: "#F0F8FF",
        borderRadius: "40px",
      }}
    >
      <Grid item xs={12}>
        <Grid container marginBottom={"6%"}>
          <Grid item xs={12} height={100} marginBottom={"4%"}>
            <Typography
              style={{ fontWeight: "bold" }}
              variant="h5"
              component="h1"
              gutterBottom
            >
              All {authorNameProps.name}'s Publications published in{" "}
              {conferencesProps.join(", ")}
            </Typography>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">
                This list contains all of {authorNameProps.name}'s publications
                that have been published in {conferencesProps.join(", ")}{" "}
                conferences. Publications are ordered in descending order based
                on the number of citations they have received, highlighting
                those with the greatest academic impact at the top of the list.
              </Typography>

              <Grid item justify="center" alignItems="center">
                <i
                  className="fas fa-question-circle text-blue"
                  onMouseOver={() => setImageTooltipOpen(true)}
                  onMouseOut={() => setImageTooltipOpen(false)}
                >
                  {imageTooltipOpen && (
                    <InfoBox
                      marginLeft={"0%"}
                      style={{
                        transform: "translateX(-50%)",
                      }}
                      Info={`By clicking on artical icon, detailed information about the 
                         publication will be shown`}
                    />
                  )}
                </i>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Paper
              style={{ width: "100%", borderRadius: "40px", padding: "5%" }}
            >
              <Grid item xs={12} style={{ marginBottom: "0%", margin: "2%" }}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  onChange={handleSearch}
                />
                <List
                  sx={{
                    width: "100%",

                    bgcolor: "background.paper",
                    maxHeight: 300,
                    position: "relative",
                    overflow: "auto",
                  }}
                >
                  {publications.map((publication) => (
                    <ListItem
                      key={publication.id}
                      disableGutters
                      secondaryAction={
                        <div>
                          <IconButton
                            aria-label="comment"
                            onClick={() => {
                              getSelectedPublication(publication);
                            }}
                          >
                            <ArticleIcon />
                          </IconButton>
                          <IconButton
                            aria-label="topics"
                            onClick={() => {
                              setSelectedPublication(publication);
                              selectedPublicationProp(publication);
                            }}
                          >
                            <Typography>Topics</Typography>
                          </IconButton>
                        </div>
                      }
                    >
                      <ListItemText
                        primary={
                          <Grid item xs={10}>
                            <Typography>{`${publication.title}`}</Typography>
                          </Grid>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
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
  );
}
