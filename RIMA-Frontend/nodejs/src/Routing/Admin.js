import React, {useEffect, useState} from "react";
import {Redirect, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RecommendationRoute from './RecommendationRoute';
import routes from "./routes";
import {getItem} from "../Services/utils/localStorage";
import NavigationBar from "../Views/Application/ReuseableComponents/NavigationBar/NavigationBar";
import {Col, Row} from "react-bootstrap";

export default function Admin(props) {
  const [isRedirect, setIsRedirect] = useState(false);

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
      <div className="header bg-gradient-info mb-14 pt-14 pt-md-8" style={customStyles.mainContainer}>
        <Row>
          <Col md={1} xs={0}/>
          <Col md={10} xs={12}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/app/PieChartPage"/>
            </Switch>
          </Col>
          <Col md={1} xs={0}/>
        </Row>
      </div>
    </>
  );
}
