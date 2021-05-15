import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {getItem} from "../Services/utils/localStorage";


const PublicRoute = ({isAuthenticated, component: Component, ...rest}) => {
  const TOKEN = getItem("accessToken");
  return (
    <Route {...rest} component={(props) => TOKEN ?
      <Redirect to="/app/index"/> :
      <Component {...props} />}
    />
  )

};


export default PublicRoute;
