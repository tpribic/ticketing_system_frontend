import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthLayout from "./Components/Layouts/AuthLayout/index";
import DashboardLayout from "./Components/Layouts/DashboardLayout/index";
import Login from "./Components/LoginForm/index";
import Register from "./Components/RegisterForm/index";
import AuthService from "./Services/AuthService";

const MainRoutes = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={AuthLayout} />
      <Route exact path="/login" component={AuthLayout} />
      <Route exact path="/register" component={AuthLayout} />
      <Route path="/dashboard" component={DashboardLayout} />
      <Route
        component={function notFound() {
          return <p>not found</p>;
        }}
      />
    </Switch>
  );
};

export default MainRoutes;
