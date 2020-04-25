import { App } from 'App';
import history from'browserHistorySetup';
import { BidPage } from 'pages';
import React from 'react';
import { Route, Router, Switch, RouteComponentProps } from 'react-router-dom'; 

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

export const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={App} />
        <Route path='/auction/:id' exact render={( { match } ) => (<BidPage id={match.params.id} /> )} />
      </Switch>
    </Router>
  )
}
