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
      <Route path="/login" component={AuthLayout}>
        {user !== undefined ? <Redirect to="/dashboard" /> : null}
      </Route>
      <Route path="/register" component={AuthLayout}>
        {user !== undefined ? <Redirect to="/dashboard" /> : null}
      </Route>
      <Route exact path="/" component={DashboardLayout}>
        <Redirect to="/dashboard" />
      </Route>
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
