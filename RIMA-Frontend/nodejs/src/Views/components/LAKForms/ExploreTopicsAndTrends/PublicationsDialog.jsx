import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

import WhyInterest from "../../../Application/InterestProfile/Tabs/WhyInterest/WhyInterest";

const PublicationDialog = ({ openDialogProps, papersProps }) => {
  const [papers, setPapers] = useState(papersProps);
  const [originalKeywords, setOriginalKeywords] = useState([]);
  const [openDialog, setOpenDiaglog] = useState(openDialogProps);

  const handleDiaglog = () => {
    setOpenDiaglog(false);
  };

  return (
    <>
      <Dialog open={openDialog} fullWidth={true} maxWidth="lg">
        <DialogTitle>Publications List</DialogTitle>
        <DialogContent>
          <Paper elevation={0}>
            <Grid container>
              <Grid item xs={12}>
                {papers && (
                  <WhyInterest
                    papers={papers}
                    originalKeywords={originalKeywords}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions style={{ padding: 16 }}>
          <Button onClick={handleDiaglog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PublicationDialog;
