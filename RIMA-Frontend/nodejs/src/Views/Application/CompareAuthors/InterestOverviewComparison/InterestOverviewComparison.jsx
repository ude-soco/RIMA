import React from 'react'
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import {getUserInfo} from "../../../../Services/utils/functions";
import CloudChart from "../../ReuseableComponents/Charts/CloudChart/CloudChart";

export default function InterestOverviewComparison ({classes, compareAuthor}) {
  const currentUser = getUserInfo();
  return (
   <>
     <Card className={classes.cardHeight}>
       <CardContent>
         <Grid container justify="center" className={classes.gutterLarge}>
           <Grid item>
             <Typography variant="h5" >
               <b> Interests Overview </b>
             </Typography>
           </Grid>
         </Grid>

         <Grid container>
           <Grid item xs={6}>
             <Grid container direction="column" alignItems="center">
               <Typography variant="h5">
                 {currentUser.first_name} {currentUser.last_name}
               </Typography>

               <CloudChart/>
             </Grid>
           </Grid>
           <Grid item xs={6}>
             <Grid container direction="column" alignItems="center">

               <Typography variant="h5">
                 {compareAuthor.first_name} {compareAuthor.last_name}
               </Typography>

               <CloudChart user={compareAuthor}/>
             </Grid>
           </Grid>
         </Grid>
       </CardContent>
     </Card>
   </>
  );
}
