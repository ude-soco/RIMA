import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Card, CardActionArea, Grid, Typography} from "@material-ui/core";

// Define styling using Material-UI's makeStyles hook
const useStyles = makeStyles((theme) => ({
  card: {
    border: "1px solid #e4e4e4",
    borderRadius: 6,
    margin: 4,
    alignItems: "center"
  },
  imageContainer: {
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
}));

// React component named 'Contact' with props
function Contact(props) {
  const {authorId} = props;
  const classes = useStyles();

  return (
    <Grid container>
      {/* Title for the Semantic Scholar link */}
      <Grid item xs={12} align="center" style={{paddingBottom:16}}>
        <Typography variant="h5">
          Visit this users Semantic Scholar page
        </Typography>
      </Grid>

      {/* Grid container for displaying Semantic Scholar card or error message depending on authorId*/}
      <Grid container alignItems="center" justify="center">        
        {authorId ? (
          <Grid item sm={8} md={4} align="center">
            <Card elevation={0} className={classes.card}>
              <CardActionArea
                onClick={() =>
                  // Open the Semantic Scholar page in a new tab
                  window.open(
                    `https://www.semanticscholar.org/author/${authorId}`,
                    "_blank"
                  )
                }
              >
                {/* Container for content inside the card */}
                <div className={classes.contentContainer}>
                  <Typography align="center">Semantic Scholar</Typography>
                  {/* Logo image for Semantic Scholar */}
                  <div className={classes.imageContainer}>
                    <img
                      src="/images/ss-logo.png"
                      height="100"
                      alt="Semantic Scholar Logo"
                    />
                  </div>
                  {/* Display the authorId */}
                  <Typography align="center">
                    ID: <b>{authorId}</b>
                  </Typography>
                </div>
              </CardActionArea>
            </Card>
          </Grid>
        ) : (
          // Display error message if authorId is not available
          <Grid item xs={12} align="center">
            <Typography variant="h6" color="error">
              Error. Can't find authorId.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default Contact;
