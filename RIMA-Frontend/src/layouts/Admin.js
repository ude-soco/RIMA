import React from "react";
import {Switch, Redirect} from "react-router-dom";
// reactstrap components
import {Container} from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import PrivateRoute from "../routes/PrivateRoute";
import RecommendationRoute from '../routes/RecommendationRoute';

import routes from "../routes/routes";
import {getItem} from "../utils/localStorage";

class Admin extends React.Component {
  state = {
    isredirect: false,
  };

  componentDidMount() {
    if (this.props.location.pathname == "/app/redirect") {
      console.log(1);
      this.setState({isredirect: true});
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
        {this.state.isredirect ? (
          <></>
        ) : (
          <>
            <AdminNavbar
              {...this.props}
              brandText={this.getBrandText(this.props.location.pathname)}
            />,
            <Sidebar
              {...this.props}
              routes={routes}
              logo={{
                innerLink: "/app/index",
                imgSrc: require("assets/img/brand/argon-react.png"),
                imgAlt: "...",
              }}
            />
          </>
        )}
        <div className="main-content" ref="mainContent">
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/app/PieChartPage"/>
          </Switch>
          <Container fluid>
            <AdminFooter/>
          </Container>
        </div>
      </>
    );
  }
}

export default Admin;
