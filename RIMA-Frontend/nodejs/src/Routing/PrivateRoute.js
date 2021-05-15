import React from 'react';
import {getItem} from "../Services/utils/localStorage";
import {Route, Redirect} from 'react-router-dom';


const PrivateRoute = ({component: Component, auth, ...rest}) => {
  const TOKEN = getItem("accessToken");
  return (
    <Route {...rest} render={props => TOKEN ?
      <Component {...props} /> :
      <Redirect from="/" to="/auth/login"/>}
    />
  )
};


export default PrivateRoute;
