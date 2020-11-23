import './App.scss';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Members from './Members';
import CreateMember from './CreateMember';
import LeftNav from './LeftNav';
import Header from './Header';
import CreateCustomer from './CreateCustomer';
import Axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import Customers from './Customers';
import EditCustomer from './EditCustomer';

export default class App extends React.Component {
  state = {
    loading: true,
  }

  componentDidMount() {
    Axios.interceptors.request.use(config => {
      if (config.url && config.url.indexOf('http') !== 0) {
        config.url = `${window.location.protocol}//${window.location.hostname}:5000/api${config.url}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
    this.setState({loading: false});
  }

  render() {
    const {loading} = this.state;

    if (loading) {
      return <CircularProgress className="app-loading" />;
    } else {
      return (
        <Router>
          <div className="app-wrapper">
            <Header />
            <LeftNav />
            <div className="content">
              <Switch>
                <Route path="/" exact={true}>
                  <Redirect to="/members" />
                </Route>
                <Route path="/create">
                  <CreateCustomer />
                </Route>
                <Route path="/new/:cust_id">
                  <CreateMember />
                </Route>
                <Route path="/members">
                  <Members />
                </Route>
                <Route path="/customers" exact={true}>
                  <Customers />
                </Route>
                <Route path="/customers/:id">
                  <EditCustomer />
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
}
