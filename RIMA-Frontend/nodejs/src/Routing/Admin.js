import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import PrivateRoute from "./PrivateRoute";
import RecommendationRoute from './RecommendationRoute';

import routes from "./routes";
import {getItem} from "../utils/localStorage";

class Admin extends React.Component {
  state = {
    isRedirect: false,
  };


  componentDidMount() {
    if (this.props.location.pathname === "/app/redirect") {
      console.log(1);
      this.setState({ isRedirect: true });
    }
  }


  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }


  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/app") {
        return (
          <PrivateRoute
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else if(prop.layout === "/recommendation") {
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


  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "";
  };


  render() {
    return (
      <>
        {this.state.isRedirect ? <></> : (
          <Sidebar
            {...this.props}
            routes={routes}
            logo={{
              innerLink: "/app/index",
              imgSrc: require("assets/img/brand/argon-react.png"),
              imgAlt: "...",
            }}
          />
        )}
        <div className="main-content" ref="mainContent">
          {this.state.isRedirect ? <></> : (
            <AdminNavbar
              {...this.props}
              brandText={this.getBrandText(this.props.location.pathname)}
            />
          )}
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/app/PieChartPage" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
