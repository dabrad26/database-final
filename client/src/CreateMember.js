import { Card, CardContent, CircularProgress, Fab, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { withRouter } from 'react-router-dom';
import Error from './Error';
import AddIcon from '@material-ui/icons/Add';

export class CreateMember extends React.Component {
  state = {
    loading: true,
    error: false,
  }

  customerData;
  membershipTypes;
  employees;
  paymentTypes = ['Cash', 'Check', 'Money Order', 'American Express', 'Discover', 'Visa', 'Mastercard', 'Gift Card'];
  model = {
    membership_type_id: 2,
    promotion_id: 'NONE',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    payment_method: 'Cash',
  };

  get currentMembershipInfo() {
    if (this.customerData.membership_id) {
      const membershipType = this.membershipTypes.filter(type => this.customerData.membership_type_id === type.membership_type_id)[0] || {};
      return (
        <div>
          {!!this.customerData.organization_id &&
            <>
              <h3>Current Organization</h3>
              <p>{this.customerData.org_name} (Discount: {this.customerData.org_discount_percent}%)</p>
            </>
          }
          <h3>Current Membership</h3>
          <p>{membershipType.name}, Expires on {new Date(this.customerData.end_date).toString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          {!!this.customerData.organization_id &&
            <>
              <h3>Current Organization</h3>
              <p>{this.customerData.org_name} (Discount: {this.customerData.org_discount_percent}%)</p>
            </>
          }
          <h3>Current Membership</h3>
          <p>No past memberships</p>
        </div>
      );
    }
  }

  get formContent() {
    return (
      <div>
        <FormControl>
          <InputLabel id="employee_id-label">Sales Associate</InputLabel>
          <Select labelId="employee_id-label" id="employee_id" onChange={event => {this.model.employee_id = event.target.value; this.setState({});}} value={this.model.employee_id}>
            {this.employees.map((item, index) => {
              return <MenuItem key={index} value={item.employee_id}>{`${item.first_name} ${item.last_name} (${item.title})`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="membership_type_id-label">Membership Type</InputLabel>
          <Select labelId="membership_type_id-label" id="membership_type_id" onChange={event => {this.model.membership_type_id = event.target.value; this.setState({});}} value={this.model.membership_type_id}>
            {this.membershipTypes.map((item, index) => {
              return <MenuItem key={index} value={item.membership_type_id}>{`${item.name} ($${item.price})`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField onChange={event => {this.model.second_adult_name = event.target.value; this.setState({});}} value={this.model.second_adult_name || ''} id="second_adult_name" label="Second adult name" />
        <FormControl>
          <InputLabel id="promotion_id-label">Promotions</InputLabel>
          <Select labelId="promotion_id-label" id="promotion_id" onChange={event => {this.model.promotion_id = event.target.value; this.setState({});}} value={this.model.promotion_id}>
            <MenuItem value={'NONE'}>None</MenuItem>
            {this.promotions.map((item, index) => {
              return <MenuItem key={index} value={item.promotion_id}>{`${item.name} (${item.promotion_term})`}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="payment_method-label">Payment method</InputLabel>
          <Select labelId="payment_method-label" id="payment_method" onChange={event => {this.model.payment_method = event.target.value; this.setState({});}} value={this.model.payment_method}>
            {this.paymentTypes.map((item, index) => {
              return <MenuItem key={index} value={item}>{item}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField onChange={event => {this.model.total_paid = event.target.value; this.setState({});}} value={this.model.total_paid || ''} id="total_paid" label="Total Paid" />
        <TextField id="end_date" onChange={event => {this.model.end_date = event.target.value; this.setState({});}} label="New Expiration Date (YYYY-MM-DD)" type="date" value={this.model.end_date} />
      </div>
    )
  }

  get membershipDetails() {
    const membershipType = this.membershipTypes.filter(type => this.model.membership_type_id === type.membership_type_id)[0] || {};
    return (
      <>
        <h3>Membership Benefits</h3>
        <p><b>Name: </b>{membershipType.name}</p>
        <p><b>Price: </b>${membershipType.price}</p>
        <p><b>Number Guests: </b>{membershipType.number_guests}</p>
        <p><b>Number Movie Tickets: </b>{membershipType.number_movie_tickets}</p>
        <p><b>Employee Incentive: </b>${membershipType.employee_incentive}</p>
      </>
    )
  }

  get form() {
    return (
      <div className="create-membership">
        <h2>Create membership for {this.customerData.first_name} {this.customerData.last_name}</h2>
        <Card>
          <CardContent>{this.currentMembershipInfo}</CardContent>
        </Card>
        <div className="create-membership--form-wrapper">
          <div className="create-membership--form-wrapper-item">{this.formContent}</div>
          <Card className="create-membership--form-wrapper-item">
            <CardContent>{this.membershipDetails}</CardContent>
          </Card>
        </div>
        <Fab disabled={!this.isValid} variant="extended" className="floating-button" onClick={this.save}>
          <AddIcon />
          Create
        </Fab>
      </div>
    );
  }

  get isValid() {
    return (
      this.model.customer_id &&
      this.model.employee_id &&
      this.model.membership_type_id &&
      this.model.total_paid &&
      this.model.payment_method &&
      this.model.start_date &&
      this.model.end_date
    );
  }

  save = () => {
    const data = Object.assign({}, this.model);
    if (data.promotion_id === 'NONE') delete data.promotion_id;
    Axios.post('/memberships', data).then(response => {
      window.sql_queries.set(this.model.customer_id ? 'create_membership' : `renew_membership_${this.model.membership_id}`, response.data.query);
      this.props.history.push('/members');
    }).catch(error => {
      console.error('Unable to save membership', error);
    })
  }


  getData() {
    const {match} = this.props;
    this.setState({loading: true, error: false});
    const custId = match.params['cust_id'];
    if (!custId) return this.setState({loading: false, error: true});

    Axios.get(`/customers/${custId}/membership`).then(response => {
      this.customerData = response.data.data;
      window.sql_queries.set(`get_customer_membership_${custId}`, response.data.query);
      this.model.customer_id = this.customerData.customer_id;
      if (this.customerData.membership_id) {
        this.model.membership_type_id = this.customerData.membership_type_id;
        this.model.second_adult_name = this.customerData.second_adult_name;
        this.model.membership_id = this.customerData.membership_id;
        this.model.end_date = new Date(new Date(this.customerData.end_date).setFullYear(new Date(this.customerData.end_date).getFullYear() + 1)).toISOString().split('T')[0];
      }
      Axios.get(`/membership_types`).then(types => {
        this.membershipTypes = types.data.data;
        window.sql_queries.set('get_membership_types', types.data.query);
        Axios.get(`/promotions`).then(promotions => {
          this.promotions = promotions.data.data;
          window.sql_queries.set('get_promotions', promotions.data.query);
          Axios.get(`/employees`).then(employees => {
            this.employees = employees.data.data;
            window.sql_queries.set('get_employees', employees.data.query);
            this.model.employee_id = this.employees[0].employee_id;
            this.setState({loading: false});
          }).catch(error => {
            console.error('Encountered an error getting employees', error);
            this.setState({error: true, loading: false});
          })
        }).catch(error => {
          console.error('Encountered an error getting promotions', error);
          this.setState({error: true, loading: false});
        })
      }).catch(error => {
        console.error('Encountered an error getting membership types', error);
        this.setState({error: true, loading: false});
      })
    }).catch(error => {
      console.error('Encountered an error getting customer with membership', error);
      this.setState({error: true, loading: false});
    })
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props;

    if (prevProps.match.params['cust_id'] !== match.params['cust_id']) {
      this.getData();
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const {loading, error} = this.state;

    if (loading) {
      return <CircularProgress className="app-loading" />;
    } else if (error) {
      return <Error />;
    } else {
      return this.form;
    }
  }
}

export default withRouter(CreateMember);
