import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthLayout from "./Components/Layouts/AuthLayout/index";
import DashboardLayout from "./Components/Layouts/DashboardLayout/index";
import Login from "./Components/LoginForm/index";
import Register from "./Components/RegisterForm/index";

const MainRoutes = () => {
  return (
    <Switch>
      <Route exact path="/login" component={AuthLayout} />
      <Route exact path="/register" component={AuthLayout} />
      <Route path="/dashboard" component={DashboardLayout} />
      {/* <Route exact path="/user" component={AuthLayout} />
      <Route exact path="/employee" component={AuthLayout} /> */}
      {/* <Route exact path="/admin" component={AdminLayout} /> */}
    </Switch>
  );
};

export default MainRoutes;
