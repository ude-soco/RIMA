import React from "react";
import {useHistory} from "react-router-dom";
import {AppBar, Button, Grid, makeStyles, Toolbar, Typography} from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  appBar: {
    backgroundColor: "#172B4D",
  },
  buttonSpacing: {
    textTransform: "none",
    marginRight: theme.spacing(2)
  },
  button: {
    textTransform: "none"
  },
}))

export default function NavigationBar() {
  const history = useHistory();
  const styles = useStyle();

  return (
    <>
      <AppBar className={styles.appBar}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs>
              <img src={"/images/rimaLogo.svg"} height='38' alt="Logo"/>
            </Grid>


            <Button
              color="inherit"
              onClick={() => history.push("/auth/demo")}
              className={styles.buttonSpacing}
            >
              Demo
            </Button>

            <Button
              color="primary" variant="contained"
              className={styles.button}
              onClick={() => history.push("/auth/login")}>
              Sign in
            </Button>

          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
