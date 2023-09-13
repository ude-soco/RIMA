//implemented by Islam Abdelghaffar

import React, { useEffect, useState } from "react";
import Select from "react-select";

import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL_CONFERENCE } from "../../../Services/constants";

import {
  Dialog,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  CardContent,
  Link,
  Paper,
  TextField,
  Box,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import RIMAButton from "./RIMAButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function CustomizedDialog(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

CustomizedDialog.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const {
    publications,
    keywordsOrTopicsProp,
    selectedKeywordTopicProp,
    eventnameProp,
    keywordsOrTopicProp,
    firstEvent,
    secondEvent,
  } = props; 
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState({ title: "", data: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPublications, setFilteredPublications] =
    useState(publications);
  const [imageTooltipOpen, setImageTooltipOpen] = useState(false);
  const [keywordTopic_name, setkeywordTopic_name] = useState(
    selectedKeywordTopicProp
  );
  const [eventName, setEventName] = useState(eventnameProp);
  const [keywordsOrTopic, setKeywordsOrTopic] = useState(keywordsOrTopicProp);

  useEffect(() => {
    setEventName(eventnameProp);
    setkeywordTopic_name(selectedKeywordTopicProp);
  }, [eventnameProp, selectedKeywordTopicProp]);
  useEffect(() => {
    setFilteredPublications(
      publications.filter((publication) =>
        publication.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [publications, searchTerm]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleListItemClick = (item) => {
    setSelectedItem(item);
  };
  const getPublicationList = async () => {
    try {
      const response = await fetch(
        BASE_URL_CONFERENCE +
        "conference/" +
        " " +
        "/event/" +
        eventName +
        "/word/" +
        keywordTopic_name +
        "/publications"
      );
      const result = await response.json();
      setFilteredPublications(result.publicationList);
    } catch (error) {}
  };
  const getPublicatoinListAuthorBased = async () => {
    try {
      const response = await fetch(
        BASE_URL_CONFERENCE +
          "AuthorInterestsNew" +
          "/" +
          firstEvent +
          "&" +
          keywordsOrTopic +
          "&" +
          keywordTopic_name
      );
      const result = await response.json();
      setFilteredPublications(result.publicationList);
    } catch (error) {}
  };
  useEffect(() => {
    getPublicationList();
  }, [keywordTopic_name]);

  return (
    <Box>
      <RIMAButton name={"Show publications list"} onClick={handleClickOpen} />
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
        fullWidth
        sx={{ width: "100%", height: "90vh" }}
      >
        <CustomizedDialog
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ fontWeight: "bold" }}
        >
          Publications list
          {
            <Grid container xs={12} spacing={2}>
              <Grid item xs={6}>
                <Select
                  placeholder="Select keyword/topic"
                  options={keywordsOrTopicsProp}
                  value={keywordsOrTopicsProp.find(
                    (obj) => obj.value === keywordTopic_name
                  )}
                  onChange={(k) => setkeywordTopic_name(k.value)}
                  isFullWidth
                  styles={{ zIndex: 999 }}
                />
              </Grid>
              <Grid item xs={3}>
                <i
                  className="fas fa-question-circle text-blue"
                  onMouseOver={() => setImageTooltipOpen(true)}
                  onMouseOut={() => setImageTooltipOpen(false)}
                >
                  {imageTooltipOpen && (
                    <InfoBox
                      Info={`Select a topic/keyword to get the relevant based-event publications list`}
                    />
                  )}
                </i>
              </Grid>
            </Grid>
          }
        </CustomizedDialog>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "row",
            overflow: "auto",
            height: "90vh",
            maxHeight: "90vh",
          }}
        >
          <br></br>
          <br></br>
          <Grid container xs={12} md={4}>
            <Grid item xs={12} style={{ zIndex: 0 }}>
              <Typography style={{ marginTop: "1%" }} variant="h6">
                list of publications mentioning {keywordTopic_name} in{" "}
                {eventName}
              </Typography>
              <TextField
                label="Search publication"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <Paper style={{ maxHeight: "80%", overflow: "auto" }}>
                <List>
                  {filteredPublications.map((publication) => (
                    <ListItem
                      button
                      onClick={() => handleListItemClick(publication)}
                      key={publication.title}
                    >
                      <ListItemText primary={publication.title} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Grid container xs={12} md={6} style={{ margin: "auto" }}>
            <CardContent component={Paper} alignContent="center">
              <Typography variant="h5">{selectedItem.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Year: {selectedItem.data.years} | Citations:{" "}
                {selectedItem.data.citations}
              </Typography>
              <Typography variant="body1">
                {selectedItem.data.abstract}
              </Typography>
              <Link href={selectedItem.data.url} target="_blank" rel="noopener">
                Link to the paper
              </Link>
            </CardContent>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </Box>
  );
}
