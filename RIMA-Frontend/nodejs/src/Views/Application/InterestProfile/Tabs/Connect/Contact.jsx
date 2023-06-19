import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@mui/icons-material/Send";
import { Card, CardActionArea, Grid, Typography } from "@material-ui/core";

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
}));

function Contact(props) {
  const { authorId } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Grid item xs={12} align="center" style={{ paddingBottom: 16 }}>
          <Typography variant="h5">
            Visit this user's Semantic Scholar page
          </Typography>
        </Grid>

        <Grid container>
          {authorId ? (
            <Grid item sm={8} md={4} align="center">
              <Card elevation={0} className={classes.card}>
                <CardActionArea
                  onClick={() =>
                    window.open(
                      `https://www.semanticscholar.org/author/${authorId}`,
                      "_blank"
                    )
                  }
                >
                  <Grid container align="center" style={{ padding: 24 }}>
                    <Grid item xs>
                      <Typography align="center">Semantic Scholar</Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.imageContainer}>
                      <img
                        src="/images/ss-logo.png"
                        height="100"
                        alt="Semantic Scholar Logo"
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography align="center">
                        ID: <b>{authorId}</b>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Contact;
