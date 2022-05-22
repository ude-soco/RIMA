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


const Legends = () => {
  const classes = useStyles();

  return (
    <>
      <Box
        style={{
          border: "1px solid #E7E7E7",
          borderRadius: 8,
          padding: 16,
          // Comment this line below if you wish a fixed width
          maxWidth: 700,

        }}
      >
        <Typography style={{ fontWeight: "bold", marginBottom: 16 ,fontSize: "11pt" }}>
          Legends
        </Typography>
        <Grid item md={12} xs={12}>
            <Grid container className="align-items-center">
              <Grid item xs={6} md={2}>
                <Paper className={classes.paper} elevation={0}>
                  <hr style={{ "border-top": "2px solid #303F9F" }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={4}>
                <Paper className={classes.paper} elevation={0}>
                  Interest Keywords / Keyphrase
                </Paper>
              </Grid>
              <Grid item xs={6} md={2}>
                <Paper className={classes.paper} elevation={0}>
                  <hr style={{ "border-top": "2px dashed #303F9F" }} />
                </Paper>
              </Grid>
              <Grid item xs={6} md={4}>
                <Paper className={classes.paper} elevation={0}>
                  Interest Keywords / Keyphrase Embeddings
                </Paper>
              </Grid>
            </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Legends;
