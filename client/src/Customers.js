import { Button, CircularProgress, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

export class Customers extends React.Component {
  state = {
    loading: true,
    error: false,
    search: '',
  }

  rows = [];
  headers = [
    'Name',
    'Address',
    'Email',
    'Phone',
    'Organization'
  ];

  actions = [
    {
      icon: <LoyaltyIcon />,
      text: 'Sell Membership',
      onClick: row => {
        this.props.history.push(`/new?cust_id=${row.id}`)
      },
    },
    {
      icon: <DeleteForeverIcon />,
      text: 'Delete',
      onClick: row => {
        this.setState({loading: true});
        Axios.delete(`/customers/${row.id}`).then(response => {
          window.sql_queries.set(`delete_customer_${row.id}`, response.data.query);
          this.getRows();
        }).catch(error => {
          console.error('Unable to delete customer', error);
          this.setState({error: true, loading: false});
        })
      },
    },
  ]

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.customer_id,
        columns: [
        `${row.first_name} ${row.last_name}`,
        `${row.address}, ${row.address_2 ? `${row.address_2},` : ''} ${row.city}, ${row.state} ${row.zip}`,
        row.email,
        row.phone,
        row.organization_id ? `${row.org_name} (${row.org_discount_percent}%)` : 'None',
      ]};
    });
  }

  handleClick = (row) => {
    const {history} = this.props;
    history.push(`/customers/${row.id}`);
  }

  getRows = () => {
    const {search} = this.state;
    this.setState({loading: true});
    Axios.get(`/customers?q=${search}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set('get_customers', response.data.query);
      this.setState({loading: false});
    }, error => {
      console.error('Encountered an error getting customers', error);
      this.setState({error: true, loading: false});
    })
  }

  handleError = event => {
    if (event.key === 'Enter') {
      this.getRows()
    }
  }

  get mainView() {
    const {loading, error} = this.state;

    if (loading) {
      return <CircularProgress className="app-loading" />;
    } else if (error) {
      return <Error />;
    } else {
      return <TableList actions={this.actions} handleClick={this.handleClick} headers={this.headers} rows={this.rows} />;
    }
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    return (
      <div className="customers">
        <div className="search-container">
          <TextField id="search" label="Search Customers" onKeyUp={this.handleError} onChange={event => {this.setState({search: event.target.value});}} value={this.currentSearch} />
          <Button onClick={this.getRows} variant="contained" color="primary">Search</Button>
        </div>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(Customers);