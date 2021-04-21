import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../AccountForm.css';
import { Snackbar } from '@material-ui/core';

import { useDispatch } from 'react-redux';
import { accountLogin } from '../../../reducers/UserSlice';


function AccountLogin() {
  const dispatch = useDispatch();
  
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);

  const loginEmail = useRef();
  const loginPassword = useRef();


  /**
   * @function accountLoginSubmit - Submit form and attempt user login
   */
  async function accountLoginSubmit() {
    let data = {
      email: loginEmail.current.value,
      password: loginPassword.current.value,
    };

    try {
      const response = await dispatch(accountLogin(data));
      if ('error' in response) {
        throw response['error'];
      }

      history.push('/');

    } catch (err) {
      console.log(':accountLoginSubmit: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when signing in.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
      setErrorOpen(true);
    }
  }


  function keyboardFormSubmit(event) {
    if (event.key === 'Enter') {
      accountLoginSubmit();
    }
  }


  function closeSnackbar() {
    setErrorMessage(null);
    setErrorOpen(false);
  }


  function loginForm() {
    return (
      <form className="account-form">
        <div className="account-form-input">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" ref={loginEmail} autoFocus/>
        </div>
        <div className="account-form-input">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" ref={loginPassword} />
        </div>
      </form>
    );
  }

  function loginActions() {
    return (
      <div className="account-form-actions">
        <Link to="/">
          <button className="account-form-btn button-secondary">Cancel</button>
        </Link>
        <button className="account-form-btn button-primary" onClick={accountLoginSubmit}>Log In</button>
      </div>
    );
  }


  function snackbarDisplay() {
    return (
      <Snackbar 
        open={errorOpen}
        onClose={closeSnackbar}
        message={errorMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    );
  }


  return (
    <div className="account-form-container" onKeyPress={keyboardFormSubmit}>
      <div className="account-form-header">
        <h1>Log in</h1>
      </div>
      {loginForm()}
      {loginActions()}
      {snackbarDisplay()}
    </div>
  );
}

export default AccountLogin;