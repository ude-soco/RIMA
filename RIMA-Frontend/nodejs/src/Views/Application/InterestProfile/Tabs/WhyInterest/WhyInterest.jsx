import React from "react"
import PublicationList from "./PublicationList";
import {Box, Grid, Paper, Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fancyText: {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: 'bold',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop:"30px",
    marginBottom:"30px",
    width: "60vw"
  },
}));

const WhyInterest = (props) => {
  const {papers, originalKeywords} = props
  const classes = useStyles();
  console.log("test ", papers)
  return (
    <>
      <Box style={{marginBottom: 8}}>
        <Paper style={{padding: 16}}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{fontWeight: "bold", textTransform: "uppercase"}}
              >
                Year
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{fontWeight: "bold", textTransform: "uppercase"}}
              >
                Title
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{fontWeight: "bold", textTransform: "uppercase"}}
              >
                Author
              </Typography>
            </Grid>
            <Grid item xs={1}/>
          </Grid>
        </Paper>
      </Box>
      {papers.length > 0 ? (
        papers.map((paper) => (
          <PublicationList
            publication={paper}
            originalKeywords={originalKeywords}
          />
      ))
      ) : (
        <Typography variant="h4" className={classes.fancyText}>NO PAPERS FOUND</Typography>
      )}

    </>
  )
}

export default WhyInterest