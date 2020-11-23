import { Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';

export class EventAttended extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  membershipData;
  model = {
    number_attendees: 1
  };
  events;
  rows = [];
  headers = [
    'Event',
    'Date',
    '# Attendees',
  ];

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.membership_id,
        columns: [
        `${row.name} (${row.location})`,
        new Date(row.date_time).toLocaleDateString(),
        row.number_attendees
      ]};
    });
  }

  getRows = () => {
    const {match} = this.props;
    this.setState({loading: true});
    Axios.get(`/events_attended?membership=${match.params.id}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set(`get_events_attended_${match.params.id}`, response.data.query);
      Axios.get(`/memberships/${match.params.id}`).then(membership => {
        this.membershipData = membership.data.data;
        window.sql_queries.set(`get_membership_${match.params.id}`, response.data.query);
        Axios.get(`/events`).then(events => {
          this.events = events.data.data;
          this.model.special_event_id = this.model.special_event_id || this.events[0].special_event_id;
          this.model.membership_id = this.membershipData.membership_id;
          window.sql_queries.set('get_events', response.data.query);
          this.setState({loading: false});
        }).catch(error => {
          console.error('Encountered an error getting events', error);
          this.setState({error: true, loading: false});
        })
      }).catch(error => {
        console.error('Encountered an error getting events', error);
        this.setState({error: true, loading: false});
      })
    }).catch(error => {
      console.error('Encountered an error getting events', error);
      this.setState({error: true, loading: false});
    })
  }

  get form() {
    return (
      <form noValidate autoComplete="off">
        <FormControl>
          <InputLabel id="special_event_id-label">Event</InputLabel>
          <Select labelId="special_event_id-label" id="special_event_id" onChange={event => {this.model.special_event_id = event.target.value; this.setState({});}} value={this.model.special_event_id}>
            {this.events.map((item, index) => {
              return <MenuItem key={index} value={item.special_event_id}>{`${item.name} (${item.location})`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField type="number" onChange={event => {this.model.number_attendees = event.target.value; this.setState({});}} value={this.model.number_attendees || ''} id="number_attendees" label="Number of Attendees" />
        <div className="MuiFormControl-root">
          <Button onClick={this.attendEvent} variant="contained" color="primary">Save</Button>
        </div>
      </form>
    )
  }

  get mainView() {
    const {loading, error} = this.state;

    if (loading) {
      return <CircularProgress className="app-loading" />;
    } else if (error) {
      return <Error />;
    } else {
      return (
      <div>
        <Card>
          <CardContent>
            <h3>Special Events attended by {this.membershipData.first_name} {this.membershipData.last_name}</h3>
            <p>Membership is <b>{this.membershipData.is_expired ? 'expired' : 'valid'}</b>.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3>Attend event</h3>
            {this.form}
          </CardContent>
        </Card>
        <TableList headers={this.headers} rows={this.rows} />
      </div>
    );
    }
  }

  attendEvent = () => {
    this.setState({loading: true});
    const data = Object.assign({}, this.model);
    Axios.post('/events_attended', data).then(response => {
      window.sql_queries.set(`attend_event_${this.model.membership_id}`, response.data.query);
      this.getRows();
    }).catch(error => {
      this.setState({loading: false});
      console.error('Unable to save attend event usage', error);
    })
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    return (
      <div className="attend-event-used">
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(EventAttended);
