import { Typography, Box, Grid, Divider, Paper, Hidden  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: "start",
      color: theme.palette.text.secondary,
      shadow: "none",
      fontSize: "10pt"
    }
  }));


const EmbeddingLegends = ({style}) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        style={{...style,
          padding: 16,
          maxWidth: 600,
          marginTop:15,
          marginLeft:50,
          marginRight:50

        }}
      >
        <Typography style={{ fontWeight: "bold", marginBottom: 16 ,fontSize: "11pt" }}>
          Legend
        </Typography>
        <Grid item md={12} xs={12}>
            <Grid container className="align-items-center">
              <Grid item xs={6} md={2}>
                <Paper className={classes.paper} elevation={0}>
                  <hr style={{ "border-top": "2px solid #363636" }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={4}>
                <Paper className={classes.paper} elevation={0} style={{ "color":  "#363636" }}> Keyword
                </Paper>
              </Grid>
              <Grid item xs={6} md={2}>
                <Paper className={classes.paper} elevation={0}>
                  <hr style={{ "border-top": "2px dashed #363636" }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={4}>
                <Paper className={classes.paper} elevation={0} style={{ "color":  "#363636" }}>
                  Keyword Embedding
                </Paper>
              </Grid>
            </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default EmbeddingLegends;
