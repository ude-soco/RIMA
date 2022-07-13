import React from "react"
import PublicationList from "./PublicationList";
import {Box, Grid, Paper, Typography} from "@material-ui/core";

const WhyInterest = (props) => {
  const {papers, originalKeywords} = props
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
      {papers.map((paper) => {
        return <PublicationList publication={paper} originalKeywords={originalKeywords}/>;
      })}
    </>
  )
}

export default WhyInterest