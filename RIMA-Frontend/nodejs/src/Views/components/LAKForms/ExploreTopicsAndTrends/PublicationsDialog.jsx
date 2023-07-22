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

const PublicationDialog = ({
  openDialogProps,
  papersProps,
  handleCloseDiaglog,
  originalKeywordsProps,
  ConfsOrEventsNameProps,
}) => {
  return (
    <>
      <Dialog open={openDialogProps} fullWidth={true} maxWidth="lg">
        <DialogTitle>
          Publications List in{" "}
          {Array.from(new Set(papersProps.map((pub) => pub.event))).join(",")}
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0}>
            <Grid container>
              <Grid item xs={12}>
                {papersProps && (
                  <WhyInterest
                    papers={papersProps}
                    originalKeywords={originalKeywordsProps}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions style={{ padding: 16 }}>
          <Button
            onClick={handleCloseDiaglog}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PublicationDialog;