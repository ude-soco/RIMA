// new class created by Islam
import { Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import InteractiveVennDiagram from "../../../Application/ReuseableComponents/InteractiveVennDiagram";
import RIMAButton from "Views/Application/ReuseableComponents/RIMAButton";
import { BASE_URL_CONFERENCE } from "../../../../Services/constants";
import SelectWithCancelIcon from "../../../Application/ReuseableComponents/SelectWithCancelIcon.jsx";
import { Typography } from "@material-ui/core";
import PublicationDialog from "../../../components/LAKForms/ExploreTopicsAndTrends/PublicationsDialog.jsx";

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
  const [showWarning, setShowWarning] = useState(false);
  const [showSimilarityWarning, setShowSimilarityWarning] = useState(false);
  const [eventSelectedTwice, setEventSelectedTwice] = useState("");
  const [listContent, setListContent] = useState([]);
  const [publicationList, setPublicationList] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

  const handleCompare = async () => {
    SetSets([]);
    setListContent([]);
    const isOneEvent = oneEventSelected();
    if (isOneEvent) {
      setShowWarning(true);
      setShowSimilarityWarning(false);
      return;
    }
    const isSimilar = twoSimilarEventsSelected();
    if (isSimilar) {
      setShowWarning(false);
      setShowSimilarityWarning(true);
      return;
    }

    setButtonActive(true);

    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getSharedTopicsBetweenEvents/" +
        firstSelectedEvent +
        "&" +
        secondSelectedEvent +
        "&" +
        thirdSelectedEvent
    );
    const response = await request.json();
    SetSets(response.sets);
    setListContent(response.names);
    setShowWarning(false);
    setShowSimilarityWarning(false);
  };
  const oneEventSelected = () => {
    let firstSecond = firstSelectedEvent === "" && secondSelectedEvent === "";
    let firstThird = firstSelectedEvent === "" && thirdSelectedEvent === "";
    let secondThird = secondSelectedEvent === "" && thirdSelectedEvent === "";

    if (firstSecond || firstThird) {
      return true;
    }
    if (secondThird) {
      return true;
    }
    return false;
  };

  const twoSimilarEventsSelected = () => {
    if (
      firstSelectedEvent === secondSelectedEvent ||
      firstSelectedEvent === thirdSelectedEvent
    ) {
      setEventSelectedTwice(firstSelectedEvent);
      return true;
    }
    if (secondSelectedEvent === thirdSelectedEvent) {
      setEventSelectedTwice(secondSelectedEvent);
      return true;
    }
    return false;
  };

  const clearSelectedEvent = (event) => {
    let selectedEvent;
    switch (event) {
      case "firstEvent":
        selectedEvent = firstSelectedEvent;
        setFirstSelectEvent("");
        break;
      case "secondEvent":
        selectedEvent = secondSelectedEvent;
        setSecondSelectEvent("");
        break;
      case "thirdEvent":
        selectedEvent = thirdSelectedEvent;
        setthirdSelectEvent("");
        break;
      default:
        break;
    }
  };

  const handleCloseDiaglog = () => {
    setOpenDiaglog(false);
  };

  const handleGetPublications = async (selectedWord, selectedEvents) => {
    console.log("selected Item: ", selectedWord);
    console.log("selectedEvents: ", selectedEvents);
    setSelectedWord(selectedWord);
    let Events = selectedEvents.replace(/and/g, "&");
    console.log("Events", Events.trim());
    if (selectedWord == "") {
      return;
    }

    const request = await fetch(
      BASE_URL_CONFERENCE +
        "getRelaventPublicationsList/keyword/" +
        Events +
        "&" +
        selectedWord
    );

    const response = await request.json();
    console.log("response00: ", response["publicationList"]);
    setOpenDiaglog(true);
    setPublicationList(response["publicationList"]);
  };

  return (
    <Grid container xs={12}>
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h5"
            component="h1"
            gutterBottom
          >
            Shared Topics Across Events
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ paddingTop: "1%" }}>
            Visualizing Shared Topics Between Selected Events Within a
            Conference
          </Typography>
        </Grid>
        <Grid container style={{ paddingTop: "3%" }}>
          <SelectWithCancelIcon
            InputLabelProps="First Event*"
            SelectLabelIdProps="First Event"
            SelectValueProps={firstSelectedEvent}
            onChangeActionProps={(e) => {
              setFirstSelectEvent(e.target.value);
            }}
            confEventsProps={confEvents}
            clearSelectedEventProps={() => clearSelectedEvent("firstEvent")}
          />
          <SelectWithCancelIcon
            InputLabelProps="Second Event*"
            SelectLabelIdProps="Second Event"
            SelectValueProps={secondSelectedEvent}
            onChangeActionProps={(e) => {
              setSecondSelectEvent(e.target.value);
            }}
            confEventsProps={confEvents}
            clearSelectedEventProps={() => clearSelectedEvent("secondEvent")}
          />
          <SelectWithCancelIcon
            InputLabelProps="Third Event (Optional)"
            SelectLabelIdProps="Third Event"
            SelectValueProps={thirdSelectedEvent}
            onChangeActionProps={(e) => {
              setthirdSelectEvent(e.target.value);
            }}
            confEventsProps={confEvents}
            clearSelectedEventProps={() => clearSelectedEvent("thirdEvent")}
          />
          <Grid
            container
            item
            xs={12}
            spacing={1}
            style={{ paddingTop: "3%", paddingLeft: "1%" }}
          >
            <Grid item>
              <RIMAButton
                name="Compare"
                onClick={handleCompare}
                activeButton={buttonActive}
              />
            </Grid>
            <Grid item>
              {showWarning && (
                <Typography variant="h6" color="error">
                  At least 2 events should be selected
                </Typography>
              )}
              {showSimilarityWarning && (
                <Typography variant="h6" color="error">
                  An Event {eventSelectedTwice} should not be selected Twice
                </Typography>
              )}
            </Grid>
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
            listContent={listContent}
            label={"topic"}
            handleGetPublications={handleGetPublications}
          />
        </Paper>
        {publicationList && publicationList.length > 0 && (
          <PublicationDialog
            openDialogProps={openDialog}
            papersProps={publicationList}
            handleCloseDiaglog={handleCloseDiaglog}
            originalKeywordsProps={[selectedWord]}
          />
        )}
      </Grid>
    </Grid>
  );
};
export default SharedTopicsVennDiagram;
