import React from 'react';
import {withRouter} from 'react-router-dom';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ViewListIcon from '@material-ui/icons/ViewList';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';

class LeftNav extends React.Component {
  state = {
    showQueries: false,
  }

  changeRoute = (route) => {
    const {history} = this.props;
    history.push(route);
  };

  render() {
    const {showQueries} = this.state;

    const classes = {
      paper: 'drawer-paper',
    };
    return (
      <>
        <Drawer variant="permanent" anchor="left" className="drawer" classes={classes}>
          <div className="MuiToolbar-regular"></div>
          <Divider />
          <List>
            <ListItem button={true} onClick={() => this.changeRoute('/create')}>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Create Customer" />
            </ListItem>
          </List>
          <List>
            <ListItem button={true} onClick={() => this.changeRoute('/new')}>
              <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
              <ListItemText primary="Sell Membership" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button={true} onClick={() => this.changeRoute('/customers')}>
              <ListItemIcon><PermContactCalendarIcon /></ListItemIcon>
              <ListItemText primary="View Customers" />
            </ListItem>
          </List>
          <List>
            <ListItem button={true} onClick={() => this.changeRoute('/members')}>
              <ListItemIcon><ViewListIcon /></ListItemIcon>
              <ListItemText primary="View Memberships" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button={true} onClick={() => {
              this.setState({showQueries: !showQueries})
            }}>
              <ListItemIcon><CodeIcon /></ListItemIcon>
              <ListItemText primary="View Queries" />
            </ListItem>
          </List>
        </Drawer>
        <Drawer anchor="bottom" open={showQueries} onClose={() => {this.setState({showQueries: false});}}>
          {[...window.sql_queries.values()].reverse().map((query, index) => {
            return <pre key={index} className="query-example">{query}</pre>;
          })}
        </Drawer>
      </>
    );
  }
}

export default withRouter(LeftNav);
