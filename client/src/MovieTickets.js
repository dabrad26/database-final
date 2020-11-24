import { Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';

export class MovieTickets extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  membershipData;
  model = {};
  movies;
  rows = [];
  headers = [
    'Movie',
    'Date',
    'Pass Used',
    'Price Paid',
  ];

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.membership_id,
        columns: [
        row.name,
        new Date(row.date_time).toLocaleDateString(),
        row.pass_used ? 'YES' : 'NO',
        `$${row.ticket_price}`,
      ]};
    });
  }

  getRows = () => {
    const {match} = this.props;
    this.setState({loading: true});
    Axios.get(`/movie_tickets?membership=${match.params.id}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set(`get_movies_${match.params.id}`, response.data.query);
      Axios.get(`/memberships/${match.params.id}`).then(membership => {
        this.membershipData = membership.data.data;
        window.sql_queries.set(`get_membership_${match.params.id}`, membership.data.query);
        Axios.get(`/current_movies`).then(movies => {
          this.movies = movies.data.data;
          this.model.movie_id = this.model.movie_id || this.movies[0].movie_id;
          this.model.type = 'ADULT';
          this.model.pass_used = this.membershipData.movie_tickets_left >= 1;
          this.model.membership_id = this.membershipData.membership_id;
          window.sql_queries.set('get_movies', movies.data.query);
          this.setState({loading: false});
        }).catch(error => {
          console.error('Encountered an error getting movie tickets', error);
          this.setState({error: true, loading: false});
        })
      }).catch(error => {
        console.error('Encountered an error getting movie tickets', error);
        this.setState({error: true, loading: false});
      })
    }).catch(error => {
      console.error('Encountered an error getting movie tickets', error);
      this.setState({error: true, loading: false});
    })
  }

  get form() {
    return (
      <form noValidate autoComplete="off">
        <FormControl>
          <InputLabel id="movie_id-label">Movie</InputLabel>
          <Select labelId="movie_id-label" id="movie_id" onChange={event => {this.model.movie_id = event.target.value; this.setState({});}} value={this.model.movie_id}>
            {this.movies.map((item, index) => {
              return <MenuItem key={index} value={item.movie_id}>{`${item.name} (Adult: $${item.adult_price}, Child: $${item.child_price})`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="type-label">Ticket Type</InputLabel>
          <Select labelId="type-label" id="type" onChange={event => {this.model.type = event.target.value; this.setState({});}} value={this.model.type}>
          <MenuItem value={'ADULT'}>Adult</MenuItem>
          <MenuItem value={'CHILD'}>Child</MenuItem>
          </Select>
        </FormControl>
        {this.membershipData.movie_tickets_left >= 1 && <div className="MuiFormControl-root"><FormControlLabel
          label="Use Pass"
          control={<Checkbox checked={this.model.pass_used} onChange={event => {this.model.pass_used = event.target.checked; this.setState({})}} name="pass_used" color="primary" />}
        /></div>}
        <div className="MuiFormControl-root">
          <Button onClick={this.sellMovie} variant="contained" color="primary">Sell ticket</Button>
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
            <h3>Movie tickets for {this.membershipData.first_name} {this.membershipData.last_name}</h3>
            <p>Membership is <b>{this.membershipData.is_expired ? 'expired' : 'valid'}</b>.</p>
            <p>Membership has <b>{this.membershipData.movie_tickets_left}</b> movie passes left.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3>Sell new movie ticket</h3>
            {this.form}
          </CardContent>
        </Card>
        <TableList headers={this.headers} rows={this.rows} />
      </div>
    );
    }
  }

  sellMovie = () => {
    this.setState({loading: true});
    const data = Object.assign({}, this.model);
    const selectedMovie = this.movies.filter(movie => movie.movie_id === data.movie_id)[0] || {};
    data.ticket_price = selectedMovie[data.type === 'ADULT' ? 'adult_price' : 'child_price'];
    delete data.type;
    Axios.post('/movie_tickets', data).then(response => {
      window.sql_queries.set(`sell_movie_${this.model.membership_id}`, response.data.query);
      this.getRows();
    }).catch(error => {
      this.setState({loading: false});
      console.error('Unable to save move ticket', error);
    })
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    return (
      <div className="movie-tickets">
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(MovieTickets);
