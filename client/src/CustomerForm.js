import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Fab } from '@material-ui/core';
import Axios from 'axios';
import Error from './Error';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';

export class CustomerForm extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  organizations = [];
  model;

  onFormChange = (event) => {
    this.model[event.target.id] = event.target.value;
    this.setState({});
  }

  save = () => {
    const data = Object.assign({}, this.model);
    if (data.organization_id === 'NONE') delete data.organization_id;
    Axios.request({
      url: '/customers',
      method: this.model.customer_id ? 'PUT' : 'POST',
      data
    }).then(response => {
      window.sql_queries.set(this.model.customer_id ? 'create_customer' : `update_customer_${this.model.customer_id}`, response.data.query);
      this.props.history.push('/customers');
    }).catch(error => {
      console.error('Unable to save customer', error);
    })
  }

  get isValid() {
    return (
      this.model.first_name &&
      this.model.last_name &&
      this.model.address &&
      this.model.city &&
      this.model.state &&
      this.model.zip
    );
  }

  componentDidMount() {
    this.model = this.props.model;
    if (!this.model.organization_id) this.model.organization_id = 'NONE';
    Axios.get('/organizations').then(response => {
      this.organizations = response.data.data;
      window.sql_queries.set('get_organizations', response.data.query);
      this.setState({loading: false});
    }, error => {
      console.error('Encountered an error getting organizations', error);
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
      return (
        <div className="create">
          <form noValidate autoComplete="off">
            <TextField onChange={this.onFormChange} value={this.model.first_name || ''} id="first_name" label="First Name" />
            <TextField onChange={this.onFormChange} value={this.model.last_name || ''} id="last_name" label="Last Name" />
            <FormControl>
              <InputLabel id="organization_id-label">Organization</InputLabel>
              <Select labelId="organization_id-label" id="organization_id" onChange={event => {this.model.organization_id = event.target.value; this.setState({});}} value={this.model.organization_id}>
                <MenuItem onChange={this.onFormChange} value={'NONE'}>None</MenuItem>
                {this.organizations.map((item, index) => {
                  return <MenuItem key={index} value={item.organization_id}>{`${item.name} (${item.discount_percent}%)`}</MenuItem>;
                })}
              </Select>
            </FormControl>
            <TextField onChange={this.onFormChange} value={this.model.address || ''} id="address" label="Address" />
            <TextField onChange={this.onFormChange} value={this.model.address_2 || ''} id="address_2" label="Address Line 2" />
            <TextField onChange={this.onFormChange} value={this.model.city || ''} id="city" label="City" />
            <TextField onChange={this.onFormChange} value={this.model.state || ''} id="state" label="State" />
            <TextField onChange={this.onFormChange} value={this.model.zip || ''} id="zip" label="Zip Code" />
            <TextField onChange={this.onFormChange} value={this.model.email || ''} id="email" label="Email" />
            <TextField onChange={this.onFormChange} value={this.model.phone || ''} id="phone" label="Phone" />
          </form>
          <Fab disabled={!this.isValid} variant="extended" className="floating-button" onClick={this.save}>
            <AddIcon />
            Save
          </Fab>
        </div>
      );
    }
  }
}

export default withRouter(CustomerForm);
