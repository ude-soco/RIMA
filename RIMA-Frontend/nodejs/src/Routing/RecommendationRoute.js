import React from 'react';
import { getItem } from "../Services/utils/localStorage";
import { Route, Redirect } from 'react-router-dom';



const RecommendationRoute = ({ component: Component, auth, ...rest }) => {
  const TOKEN = getItem("accessToken");
  // console.info("Token: ", TOKEN);
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


export default RecommendationRoute;
