import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import { Home, Coming, Staking, Accounts, Validators, Government, Proposals } from "pages";

const routePublic = (path, component) => ({
  path,
  component,
});

const routes = {
  Home: routePublic("/", Home),
  Accounts: routePublic("/accounts", Accounts),
  History: routePublic("/history", Coming),
  Staking: routePublic("/staking", Staking),
  Validators: routePublic("/staking/validators/:address", Validators),
  Government: routePublic("/government", Government),
  Proposals: routePublic("/government/proposals/:id", Proposals),
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
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);

export default route;
