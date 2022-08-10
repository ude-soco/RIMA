import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import { Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";
// import InterestCard from "./InterestCard";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import PieChartComponent from "../../TweetCharts/Pie";
// import SimilarityCard from "../TweetUtilities/SimilarityCard";
import Grid from "@material-ui/core/Grid";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // console.log(props, "dialog");
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button onClick={handleClick}>
        <ExpandMoreIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Row>
          <Col
            xs={8}
            style={{
              display: props.isAdded ? "block" : "none",
            }}
          >
            <Container>
              {Object.keys(props.percentage).length == 0 || props.isShowing ? (
                <div
                  style={{
                    marginTop: "80px",
                    marginLeft: "50px",
                    width: "350px",
                  }}
                >
                  <Button
                    disabled
                    style={{
                      fontWeight: "bold",
                      textTransform: "none",
                      marginLeft: "15px",
                      fontSize: "20px",
                    }}
                  >
                    <CircularProgress
                      style={{
                        marginRight: "10px",
                      }}
                    />
                    Possible outcome is computing...
                  </Button>
                </div>
              ) : (
                <Grid>
                  <Grid item xs>
                    Chart
                    {/* <PieChartComponent
                      interest={props.interest}
                      percentage={props.percentage}
                    /> */}
                  </Grid>
                  <Grid>
                  SimilarityCard
                    {/* <SimilarityCard
                      newTweets={props.newTweets}
                      oldTweets={props.tweets}
                      style={{ marginBottom: "5px", marginRight: "10px" }}
                    /> */}
                    <CardActions>
                      <Button
                        onClick={() => {
                          props.handleApplyChanges();
                          handleClose();
                        }}
                        style={{ marginBottom: "5px", marginLeft: "5px" }}
                        variant="outlined"
                      >
                        Apply changes
                      </Button>
                    </CardActions>
                  </Grid>
                </Grid>
              )}
            </Container>
          </Col>
          <Col xs={4}>
          InterestCard
            {/* <InterestCard
              handleSearchButtonClick1={props.handleSearchButtonClick1}
              restOfTags={props.restOfTags}
              changeTagWeight={props.changeTagWeight}
              handleDelete={props.handleDelete}
              interest={props.interest}
              handleAddition={props.handleAddition}
              isShowing={props.isShowing}
            /> */}
          </Col>
        </Row>
      </Popover>
    </div>
  );
}
