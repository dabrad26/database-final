import { Button, Checkbox, CircularProgress, FormControlLabel, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

export class Customers extends React.Component {
  state = {
    loading: true,
    error: false,
    search: '',
    activeOnly: false,
  }

  rows = [];
  headers = [
    'Name/Email',
    'Phone',
    'Membership',
    'Expires on',
    'Movie Tickets'
  ];

  actions = [
    {
      icon: <LoyaltyIcon />,
      text: 'Sell Membership',
      onClick: row => {
        this.props.history.push(`/new/${row.id}`)
      },
    },
  ]

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.customer_id,
        columns: [
        `${row.first_name} ${row.last_name} (${row.email})`,
        row.phone,
        row.name,
        new Date(row.end_date).toLocaleDateString(),
        row.movie_tickets_left
      ]};
    });
  }

  getRows = () => {
    const {search} = this.state;
    this.setState({loading: true});
    Axios.get(`/memberships?q=${search}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set('get_members', response.data.query);
      this.setState({loading: false});
    }).catch(error => {
      console.error('Encountered an error getting members', error);
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
      return <TableList actions={this.actions} headers={this.headers} rows={this.rows} />;
    }
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    const {activeOnly, search} = this.state;

    return (
      <div className="members">
        <div className="search-container">
          <TextField id="search" label="Search Members" onKeyUp={this.handleError} onChange={event => {this.setState({search: event.target.value});}} value={search} />
          <Button onClick={this.getRows} variant="contained" color="primary">Search</Button>
        </div>
        <div className="filter-container">
          <FormControlLabel
            label="Show active memberships only"
            control={<Checkbox checked={activeOnly} onChange={event => {this.setState({activeOnly: event.target.checked});}} name="active" color="primary" />}
          />
        </div>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(Customers);
