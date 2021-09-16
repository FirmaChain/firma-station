import React from "react";
import { Route, Switch } from "react-router-dom";

import Coming from "../pages/coming";

const routePublic = (path, component) => ({
  path,
  component,
});

const routes = {
  Home: routePublic("/", Coming),
  Accounts: routePublic("/accounts", Coming),
  History: routePublic("/history", Coming),
  Staking: routePublic("/staking", Coming),
  Government: routePublic("/government", Coming),
  Swap: routePublic("/swap", Coming),
  News: routePublic("/news", Coming),
  Supports: routePublic("/supports", Coming),
  BuyFirma: routePublic("/market", Coming),
  Explorer: routePublic("/explorer", Coming),
};

const CustomRoute = ({ component: Component, ...p }) => {
  const renderFunc = (props) => {
    return <Component {...props} />;
  };

  return <Route {...p} render={renderFunc} />;
};

const route = () => (
  <Switch>
    {Object.values(routes).map((x, i) => (
      <CustomRoute key={i} exact path={x.path} component={x.component} />
    ))}
  </Switch>
);

export default route;
