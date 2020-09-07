import React from 'react';
import { getItem } from "../utils/localStorage";
import { Route, Redirect } from 'react-router-dom';



const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  const TOKEN = getItem("accessToken");
  return (
    <Route
      {...rest}
      render={props =>
        TOKEN ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
            <Redirect from="/" to="/auth/login" />
          )
      }
    />
  )
};


export default PrivateRoute;