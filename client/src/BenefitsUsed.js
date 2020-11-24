import { Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import TableList from './TableList';

export class BenefitsUsed extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  membershipData;
  model = {};
  benefits;
  rows = [];
  headers = [
    'Benefit',
    'Date',
    'Price Paid',
  ];

  parseRows = (data) => {
    return data.map(row => {
      return {
        id: row.membership_id,
        columns: [
        `${row.name} (${row.discount}%)`,
        new Date(row.date_time).toLocaleDateString(),
        `$${row.price_paid}`,
      ]};
    });
  }

  getRows = () => {
    const {match} = this.props;
    this.setState({loading: true});
    Axios.get(`/benefits_used?membership=${match.params.id}`).then(response => {
      this.rows = this.parseRows(response.data.data);
      window.sql_queries.set(`get_benefits_${match.params.id}`, response.data.query);
      Axios.get(`/memberships/${match.params.id}`).then(membership => {
        this.membershipData = membership.data.data;
        window.sql_queries.set(`get_membership_${match.params.id}`, membership.data.query);
        Axios.get(`/benefits`).then(benefits => {
          this.benefits = benefits.data.data;
          this.model.benefit_id = this.model.benefit_id || this.benefits[0].benefit_id;
          this.model.membership_id = this.membershipData.membership_id;
          window.sql_queries.set('get_benefits', benefits.data.query);
          this.setState({loading: false});
        }).catch(error => {
          console.error('Encountered an error getting benefits', error);
          this.setState({error: true, loading: false});
        })
      }).catch(error => {
        console.error('Encountered an error getting benefits', error);
        this.setState({error: true, loading: false});
      })
    }).catch(error => {
      console.error('Encountered an error getting benefits', error);
      this.setState({error: true, loading: false});
    })
  }

  get form() {
    return (
      <form noValidate autoComplete="off">
        <FormControl>
          <InputLabel id="benefit_id-label">Benefit</InputLabel>
          <Select labelId="benefit_id-label" id="benefit_id" onChange={event => {this.model.benefit_id = event.target.value; this.setState({});}} value={this.model.benefit_id}>
            {this.benefits.map((item, index) => {
              return <MenuItem key={index} value={item.benefit_id}>{`${item.name} (${item.discount}%)`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField onChange={event => {this.model.price_paid = event.target.value; this.setState({});}} value={this.model.price_paid || ''} id="price_paid" label="Price Paid" />
        <div className="MuiFormControl-root">
          <Button onClick={this.useBenefit} variant="contained" color="primary">Use Benefit</Button>
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
            <h3>Benefits used by {this.membershipData.first_name} {this.membershipData.last_name}</h3>
            <p>Membership is <b>{this.membershipData.is_expired ? 'expired' : 'valid'}</b>.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3>Use New Benefit</h3>
            {this.form}
          </CardContent>
        </Card>
        <TableList headers={this.headers} rows={this.rows} />
      </div>
    );
    }
  }

  useBenefit = () => {
    this.setState({loading: true});
    const data = Object.assign({}, this.model);
    Axios.post('/benefits_used', data).then(response => {
      window.sql_queries.set(`use_benefits_${this.model.membership_id}`, response.data.query);
      this.getRows();
    }).catch(error => {
      this.setState({loading: false});
      console.error('Unable to save benefit usage', error);
    })
  }

  componentDidMount() {
    this.getRows();
  }

  render() {
    return (
      <div className="benefit-used">
        {this.mainView}
      </div>
    );
  }
}

export default withRouter(BenefitsUsed);
