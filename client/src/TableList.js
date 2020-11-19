import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';

export class TableList extends React.Component {

  handleClick = (row) => {
    const {handleClick} = this.props;

    if (handleClick) handleClick(row);
  }

  render() {
    const {headers, rows, handleClick, actions} = this.props;

    if (!Array.isArray(headers) || !Array.isArray(rows)) return null;

    return (
      <TableContainer className={`${handleClick ? 'clickable-rows' : ''}`} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => {
                return <TableCell key={index}>{header}</TableCell>;
              })}
              {Array.isArray(actions) && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length ? rows.map((row, index) => (
              <TableRow key={index}>
                {row.columns.map((col, col_index) => {
                  return <TableCell onClick={() => this.handleClick(row)} key={`${index}-${col_index}`}>{col}</TableCell>;
                })}
                {Array.isArray(actions) && <TableCell>{actions.map((action, index) => {
                  return <IconButton key={index} color="primary" onClick={() => {action.onClick(row)}} title={action.text} aria-label={action.text} component="span">{action.icon}</IconButton>
                })}</TableCell>}
              </TableRow>
            )) : <TableRow><TableCell colSpan={headers.length}>No Items</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withRouter(TableList);
