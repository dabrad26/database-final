import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export default class Header extends React.Component {

  render() {
    return (
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <Typography variant="h6">Membership Manager</Typography>
        </Toolbar>
      </AppBar>
    );
  }
}
