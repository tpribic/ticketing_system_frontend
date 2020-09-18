import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthLayout from './Components/Layouts/AuthLayout/index'
import Login from "./Components/LoginForm/index";
import Register from "./Components/RegisterForm/index";

const MainRoutes = () => {
  return (
    <Switch>
      <Route exact path="/login" component={AuthLayout} />
      <Route exact path="/register" component={AuthLayout} />
      <Route exact path="/user" component={AuthLayout} />
      <Route exact path="/admin" component={AuthLayout} />
    </Switch>
  );
};

export default MainRoutes;
