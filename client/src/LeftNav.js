import React from 'react';
import {withRouter} from 'react-router-dom';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ViewListIcon from '@material-ui/icons/ViewList';

class LeftNav extends React.Component {

  changeRoute = (route) => {
    const {history} = this.props;
    history.push(route);
  };

  render() {
    const classes = {
      paper: 'drawer-paper',
    };
    return (
      <Drawer variant="permanent" anchor="left" className="drawer" classes={classes}>
        <div className="MuiToolbar-regular"></div>
        <Divider />
        <List>
          <ListItem button={true} onClick={() => this.changeRoute('/create')}>
            <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
            <ListItemText primary="Create" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button={true} onClick={() => this.changeRoute('/')}>
            <ListItemIcon><ViewListIcon /></ListItemIcon>
            <ListItemText primary="View All" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
    );
  }
}

export default withRouter(LeftNav);
