import { CircularProgress } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import Error from './Error';

export class EditCustomer extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  model = {};

  componentDidMount() {
    const {match} = this.props;

    Axios.get(`/customers/${match.params.id}`).then(response => {
      this.model = response.data.data;
      window.sql_queries.set(`get_customer_${match.id}`, response.data.query);
      this.setState({loading: false});
    }, error => {
      console.error('Encountered an error getting specific customer', error);
      this.setState({error: true, loading: false});
    })
  }

  render() {
    const {loading, error} = this.state;

    if (loading) {
      return <CircularProgress className="app-loading" />;
    } else if (error) {
      return <Error />;
    } else {
      return <CustomerForm model={this.model} />;
    }
  }
}

export default withRouter(EditCustomer);
