import './App.scss';
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Members from './Members';
import CreateMember from './CreateMember';
import LeftNav from './LeftNav';
import Header from './Header';

export default class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="app-wrapper">
          <Header />
          <LeftNav />
          <div className="content">
            <Switch>
              <Route path="/" exact={true}>
                <Members />
              </Route>
              <Route path="/create">
                <CreateMember />
              </Route>
              <Route path="*">
                <h2>Page Not Found (404)</h2>
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
