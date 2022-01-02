import React from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Route, Redirect, Switch } from "react-router-dom";
import { rootState } from "../redux/reducers";
import { useApolloClient } from "@apollo/client";

import { Home, Staking, Accounts, History, Validators, Government, Proposals, Community } from "../pages";

const routePublic = (path: string, component: React.FC) => ({
  path,
  component,
  auth: false,
});

const routePrivate = (path: string, component: React.FC) => ({
  path,
  component,
  auth: true,
});

const routes = {
  Home: routePublic("/", Home),
  Accounts: routePrivate("/accounts", Accounts),
  History: routePrivate("/history", History),
  Staking: routePublic("/staking", Staking),
  Validators: routePublic("/staking/validators/:address", Validators),
  Government: routePublic("/government", Government),
  Proposals: routePublic("/government/proposals/:id", Proposals),
  Community: routePublic("/community", Community),
};

interface IProps {
  auth: boolean;
  exact: boolean;
  path: string;
  component: React.FC;
}

const CustomRoute = ({ auth, component: Component, ...p }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { reFetchObservableQueries } = useApolloClient();
  const { address } = useSelector((state: rootState) => state.wallet);

  const renderFunc = (props: any) => {
    if (auth) {
      if (address === "") {
        enqueueSnackbar("You Need Login First", {
          variant: "error",
          autoHideDuration: 1000,
        });

        return <Redirect to={{ pathname: "/" }} />;
      }
    }

    reFetchObservableQueries();

    return <Component {...props} />;
  };

  return <Route {...p} render={renderFunc} />;
};

const route = () => (
  <Switch>
    {Object.values(routes).map((x, i) => (
      <CustomRoute key={i} exact path={x.path} component={x.component} auth={x.auth} />
    ))}
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);

export default route;
