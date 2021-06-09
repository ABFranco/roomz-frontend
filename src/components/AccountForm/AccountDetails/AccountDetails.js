import React, {  useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './AccountDetails.css';

import { useDispatch, useSelector } from 'react-redux';
import store from '../../../store';
import { clearSignInData } from '../../../reducers/UserSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';


function AccountDetails() {
  const dispatch = useDispatch();
  const signedIn = useSelector(state => (state.user.userId != null));

  const history = useHistory();


  /**
   * Text if user is Signed-In
   */
  function userDetails() {
    return (
      <div className="account-details-user">
        <p className="account-details-msg">
        <b>{store.getState().user.firstName} {store.getState().user.lastName}</b>
        </p>
        <p className="account-details-msg"><b>Email: </b>
        {store.getState().user.email}
        </p>
      </div>
    );
  }

  function editEmail() {
    history.push('/account/details/email');
  }

  function editPassword() {
    history.push('/account/details/password');
  }

  function determineAccountDetailsActions() {
    return (
      <div className="account-details-actions">
        <button className="button-primary" onClick={editEmail}>Edit Email</button>
        <button className="button-primary" onClick={editPassword}>Edit Password</button>
        <Link to="/">
          <button className="button-secondary">Back</button>
        </Link>
      </div>
    )
  }


  function view() {
    if (!signedIn) {
      return (
        <div className="account-details-container">
          <div className="not-signed-in">
            <h2>Not Signed In</h2>
          </div>
          <Link to="/">
            <button className="account-details-form-btn button-secondary">Return Home</button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="acccount-details-container">
          <div className="account-details-header">
            <h1>Account Details</h1>
          </div>
          {userDetails()}
          {determineAccountDetailsActions()}
        </div>
      );
    }
  }

  return view();
}

export default AccountDetails;






