import React, { useState, useEffect } from "react";
import Autocomplete from "./AutoCompletion";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Slider from "./Slider";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Network from "../../TweetCharts/network/Network";
import Box from "@material-ui/core/Box";
import Button from "@mui/material/Button";

const useStyles1 = makeStyles((theme) => ({
  spacing: {
    padding: theme.spacing(2),
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  padding: {
    margin: theme.spacing(15, 0, 15, 0),
  },
}));

const useStyles = makeStyles({
  root: {
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    minWidth: 245,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function SimpleDialog(props) {
  const classes1 = useStyles1();
  const { onClose, selectedValue, open } = props;
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <Network
          classes={classes1}
          handleAddition={props.handleAddition}
          name={props.name}
        />
      </DialogTitle>
      <Button
        style={{ width: "10%", marginLeft: "10px", marginBottom: "10px" }}
        size="small"
        variant="outlined"
        onClick={handleClose}
      >
        Close
      </Button>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string,
  name: PropTypes.array,
};

export default function SimpleCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  useEffect(() => {
    setTags(props.interest);
    setExistingTags(props.interest.map((i) => i.text.toLowerCase()));

    //props.handleSearchButtonClick1();
  }, [props]);

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    if (newTag !== " ") {
      e.preventDefault();
      //alert("Jeloo");
      if (existingTags.indexOf(newTag.trim().toLowerCase()) > -1) {
        console.log("Can not add it twice");
      } else {
        setExistingTags((prevstate) => ({
          ...prevstate,
          existingTags: [...newTag.trim().toLowerCase()],
        }));

        props.handleAddition({
          id: newTag.toLowerCase(),
          text: newTag.toLowerCase(),
        });
        setNewTag(" ");
      }
    } else {
      e.preventDefault();
      console.log("Can not add it twice");
    }
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        {tags.length > 0
          ? tags.map((tag, index) => (
              <Slider
                key={tag.text}
                handleSearchButtonClick1={props.handleSearchButtonClick1}
                changeTagWeight={props.changeTagWeight}
                handleDelete={props.handleDelete}
                name={tag.text}
                color={tag.color}
                weight={tag.weight}
                index={index}
              />
            ))
          : null}
      </CardContent>

      <form
        style={{ marginLeft: "15px", marginTop: "2px" }}
        onSubmit={handleSubmit}
      >
        <Box width={180} marginTop={-3} marginLeft={1}>
          <Autocomplete
            tags={props.restOfTags}
            label="Add new interest"
            value={newTag}
            /*onChange={(e) =>
              setNewTag(e.target.value ? e.target.value : e.target.textContent)
            }*/
            onChange={setNewTag}
            style={{ borderRadius: "5px" }}
            submit={props.handleAddition}
            existed={existingTags}
          />
          {/* <TextField
            label="  Add new interest"
            defaultValue="new interest"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            style={{ borderRadius: "5px" }}
          />*/}
        </Box>
      </form>

      <IconButton onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <b style={{ fontSize: "12px" }}>What else ? </b>

      <div>
        <SimpleDialog
          open={open}
          onClose={handleClose}
          handleAddition={props.handleAddition}
          name={tags}
        />
      </div>
    </Card>
  );
}
