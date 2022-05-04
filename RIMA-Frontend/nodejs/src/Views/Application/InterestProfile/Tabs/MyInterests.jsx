import * as React from "react";
import { Button, Grid, makeStyles, Box, Modal, Typography, Slider, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import InterestOverviewNew from "./InterestOverviewNew";

const useStyles = makeStyles((theme) => ({
  spacing: {
    padding: theme.spacing(2),
  },
  cardHeight: {
    height: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  padding: {
    margin: theme.spacing(15, 0, 15, 0),
  },
}));

const style = {
  height: 300,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MyInterests() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
  <>
    <Grid justifyContent="flex-end">
      <Grid item xs={12} >
        <Button 
        variant="outlined" 
        startIcon={<EditIcon />}
        onClick={handleOpen}
        >
          Manage Interests
        </Button>
      </Grid>
      <Grid item xs={12}>
        <InterestOverviewNew classes={classes} />
      </Grid>
    </Grid>
    {/* The modal that is not really finished/showing begins here  */}
    <Modal
          open={open}
          onClose={handleClose}
          size="lg" 
          id="modal"
          
        >
          <Grid container direction="row" spacing={2} sm={style}>
            <Grid item xs={12}>
              <Typography id="modal-title" variant="h4" component="h4">
              Manage interests
              </Typography>
           </Grid>
           <Grid item xs={4}>
              <Typography variant="h6" component="h7">
              Visualization
              </Typography>
           </Grid>
           <Grid item xs={4}>
            <Slider
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
           </Grid>
           <Grid item xs={4}>
              <Typography variant="h6" component="h7">
               5.0 <IconButton> <EditIcon/> </IconButton>
              </Typography>
           </Grid>
           <Grid item xs={4}>
              <Typography variant="h6" component="h6">
              Explanation
              </Typography>
           </Grid>
           <Grid item xs={4}>
            <Slider
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
            />
           </Grid>
           <Grid item xs={4} justifycontent="flex-end">
              <Typography variant="h6" component="h6">
               4.7 <EditIcon/>
              </Typography>
           </Grid>
  
            <Grid item xs ={4}>
              <Button
              onClick={handleClose}
              > 
              Cancel
              </Button>
              </Grid>
            </Grid>
                 
        </Modal>
        </>
  );
}
