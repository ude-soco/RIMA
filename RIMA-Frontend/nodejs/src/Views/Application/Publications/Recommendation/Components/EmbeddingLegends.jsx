import { Typography, Box, Grid, Divider, Paper, Hidden  } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";


const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      shadow: "none",
      fontSize: "10pt",
      width:"100%",

    }
  }));


const EmbeddingLegends = ({style}) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        style={{...style,
          padding: 16,
          height:"auto"
        }}
      >            
        <Grid container className="align-items-center">
          <Grid item xs={12} md={12}>
            <Typography style={{ fontWeight: "bold",fontSize: "11pt" }}>
              Legend
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <hr style={{ "border-top": "2px solid #363636" }} />
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper className={classes.paper} elevation={0} style={{ "color":  "#363636"}}> Keyword
            </Paper>
          </Grid>
          <Grid item xs={6} md={2}>
            <hr style={{ "border-top": "2px dashed #363636" }} />
          </Grid>
          <Grid item xs={6} md={4}>
            <Paper className={classes.paper} elevation={0} style={{ "color":  "#363636" }}>
              Keyword Embedding
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default EmbeddingLegends;
