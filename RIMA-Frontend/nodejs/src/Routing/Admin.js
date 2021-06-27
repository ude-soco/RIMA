import React, {useEffect, useState} from "react";
import {Redirect, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RecommendationRoute from './RecommendationRoute';
import routes from "./routes";
import {getItem} from "../Services/utils/localStorage";
import NavigationBar from "../Views/Application/ReuseableComponents/NavigationBar/NavigationBar";
import {makeStyles} from "@material-ui/core";

const drawerWidth = 300;
const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.up("lg")]: {
      marginLeft: drawerWidth,
    },
  },
}))

export default function Admin(props) {
  const [isRedirect, setIsRedirect] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    if (props.location.pathname === "/app/redirect") {
      setIsRedirect(true);
    }

    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  });

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/app") {
        return (
          <PrivateRoute
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else if (prop.layout === "/recommendation") {
        return (
          <RecommendationRoute
            path={prop.layout + prop.path.replace(":id", getItem("userId"))}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null;
      }
    });
  };

  // const getBrandText = () => {
  //   for (let i = 0; i < routes.length; i++) {
  //     if (
  //       props.location.pathname.indexOf(
  //         routes[i].layout + routes[i].path
  //       ) !== -1
  //     ) {
  //       return routes[i].name;
  //     }
  //   }
  //   return "";
  // };

  const customStyles = {
    mainContainer: {
      position: "relative",
      minHeight: "100vh"
    },
  }

  return (
    <>
      {isRedirect ? <></> : <NavigationBar/>}
      <div className="header bg-gradient-info "
           style={customStyles.mainContainer}>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Switch>
            {getRoutes(routes)}
            {/*<Redirect from="*" to="/app/PieChartPage"/>*/}
            <Redirect from="*" to="/app/interest-profile"/>
          </Switch>
        </main>

      </div>
    </>
  );
}
