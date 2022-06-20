import { Typography, Grid, Paper,Table ,TableBody ,TableRow,TableCell} from "@material-ui/core";
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
          padding: 10,
          height:"auto",
          width: "50%"
        }}
      >             
        <Grid container >
          <Grid item xs={12} md={12}>
            <Typography style={{ fontWeight: "bold",fontSize: "10pt" }}>
              Legend
            </Typography>
          </Grid>
          <Table style={{ maxWidth: 500 }} aria-label="simple table">
            <TableBody>
              <TableRow >
                <TableCell  align="center" style={{  Width:"50px" }} >
                  <hr style={{ "border-top": "2px solid #363636" ,  Width:"20px"}} />
                </TableCell>
                <TableCell align="center">Data</TableCell>
                <TableCell align="center" style={{  Width:"50px" }}>
                  <hr style={{ "border-top": "2px dashed #363636", Width:"20px" }} />
                </TableCell>
                <TableCell align="center">Embedding</TableCell>
              </TableRow>
              <TableRow >
                <TableCell  align="center" style={{  Width:"50px" }} >
                  <Grid class="rectangle">
                  </Grid>
                </TableCell>
                <TableCell align="left">Process</TableCell>
                <TableCell align="center" style={{  Width:"50px" }}>
                  <Grid class="parallelogram">
                  </Grid>
                </TableCell>
                <TableCell align="left">Data</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Paper>
    </>
  );
};

export default EmbeddingLegends;
