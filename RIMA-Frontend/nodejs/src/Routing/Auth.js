import React, {useEffect} from "react";
import {Redirect, Switch} from "react-router-dom";
// reactstrap components
// core components
import routes from "./routes";
import PublicRoute from "./PublicRoute";
import NavigationBar from "../Views/Website/NavigationBar/NavigationBar";
import {Grid, makeStyles} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar
}))

export default function Auth() {
  const styles = useStyles();

  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    }
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <PublicRoute
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <NavigationBar/>
      <div className={styles.toolbar}>
        {/*<AuthNavbar />*/}

        <div className="header bg-gradient-info py-7 py-lg-8">
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>

        {/* Page content */}
        <Grid container justify="center">
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/auth/login"/>
          </Switch>
        </Grid>


      </div>

      {/*<AuthFooter />*/}
    </>
  );
}
