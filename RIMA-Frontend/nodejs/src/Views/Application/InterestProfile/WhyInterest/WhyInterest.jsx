import React, {useState} from "react";
import {Button, DialogActions, DialogContent, Typography} from "@material-ui/core";

const WhyInterest = (props) => {
  const {keywords, currentInterest, close} = props;
  const [keyword, setKeyword] = useState({})
  const [papers, setPapers] = useState([])
  const [originalKeywords, setOriginalKeywords] = useState([])


  console.log(keywords, "test")

  // useEffect(() => {
  //   keywords.map((k) => {
  //       if (k.text === currentInterest) {
  //         console.log(k, "test set keywords")
  //         setKeyword(k)
  //         setPapers(k.papers)
  //         setOriginalKeywords(k.originalKeywords)
  //       }
  //     }
  //   )
  //
  // }, [])

  return (
    <>
      <Typography variant="h5">
        Why this interest?
      </Typography>

      <DialogContent>
        <Typography>Works</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>
          Close
        </Button>
      </DialogActions>
      {/*{(keyword.source === "Manual") ?*/}
      {/*  <Typography component='div' variant="body1">*/}
      {/*    Your interest {currentInterest} has been manually added*/}
      {/*  </Typography>*/}

      {/*  : <> <Typography component='div' variant="body1">*/}
      {/*    Your interest {currentInterest} has been extracted from the following papers*/}
      {/*  </Typography>*/}
      {/*    <Grid container direction="column">*/}
      {/*      <Grid container direction="row" justify="space-between">*/}
      {/*        <Grid item xs={12}>*/}
      {/*          {(papers.length != 0) ?*/}
      {/*            papers.map((paper) => {*/}
      {/*              console.log(paper, "test Paper ")*/}
      {/*              return (<CardForPaper paper={paper} originalKeywords={originalKeywords}/>)*/}
      {/*            }) :*/}
      {/*            <></>}*/}
      {/*          /!* Here should all the components come *!/*/}
      {/*        </Grid>*/}
      {/*        <Grid item xs={false} md={2}/>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </>}*/}
    </>
  );
};

export default WhyInterest