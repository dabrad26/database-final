import { Button, CircularProgress, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';

export class IncentiveList extends React.Component {
  state = {
    loading: true,
    error: false,
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  }

  rows = [];
  headers = [
    'Name',
    'Title',
    'Total Earned',
    'Total Sold',
  ];

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.employee_id,
        columns: [
        `${row.first_name} ${row.last_name}`,
        row.title,
        `$${row.total_earned}`,
        row.total_sold,
      ]};
    });
  }

  getRows = () => {
    const {start_date, end_date} = this.state;
    this.setState({loading: true});
    Axios.get(`/incentives?start_date=${start_date}&end_date=${end_date}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set('get_incentives', response.data.query);
      this.setState({loading: false});
    }).catch(error => {
      console.error('Encountered an error getting incentive list', error);
      this.setState({error: true, loading: false});
    })
  }

  handleEnter = event => {
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
      return <TableList headers={this.headers} rows={this.rows} />;
    }
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    const {start_date, end_date} = this.state;

    return (
      <div className="incentive-list">
        <div className="date-container">
          <TextField type="date" id="start_date" label="Start Date" onKeyUp={this.handleEnter} onChange={event => {this.setState({start_date: event.target.value});}} value={start_date} />
          <TextField type="date" id="end_date" label="End Date" onKeyUp={this.handleEnter} onChange={event => {this.setState({end_date: event.target.value});}} value={end_date} />
          <Button onClick={this.getRows} variant="contained" color="primary">View Results</Button>
        </div>
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(IncentiveList);
