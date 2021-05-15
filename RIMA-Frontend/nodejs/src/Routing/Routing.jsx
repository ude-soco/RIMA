import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Admin from "./Admin";
import Auth from "./Auth";


export default function Routing() {

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path={["/app", "/recommendation"]} render={(props) => <Admin {...props} />} />
          <Route path="/auth" render={(props) => <Auth {...props} />} />
          <Redirect from="/" to="auth/login" />
        </Switch>
      </BrowserRouter>
    </>
  )
}


