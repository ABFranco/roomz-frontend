import React from 'react';

import './Notification.css';
import { Snackbar, IconButton }from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage } from '../../reducers/NotificationSlice';


function Notification() {
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => (state.notification.error));

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={errorMessage !== null}
      autoHideDuration={5000}
      onClose={() => {dispatch(clearErrorMessage())}}
      message={errorMessage}
      classes={{
        root: 'error-notification',
      }}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => {dispatch(clearErrorMessage())}}>
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}

export default Notification;