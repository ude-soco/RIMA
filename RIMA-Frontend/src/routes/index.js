import React, { Fragment } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "../layouts/Admin.js";
import AuthLayout from "../layouts/Auth.js";
const AppRouter = () => (
  <Fragment>
    <BrowserRouter>
      <Switch>
        <Route path="/app" render={(props) => <AdminLayout {...props} />} />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Redirect from="/" to="auth/login" />
      </Switch>
    </BrowserRouter>
  </Fragment>
);

export default AppRouter;
