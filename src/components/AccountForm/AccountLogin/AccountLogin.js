import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../AccountForm.css';
import { useSnackbar } from 'notistack';

import { useDispatch } from 'react-redux';
import { accountLogin } from '../../../reducers/UserSlice';


function AccountLogin() {
  const dispatch = useDispatch();
  
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
      enqueueSnackbar(errorMessage, {
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
    }
  }


  function keyboardFormSubmit(event) {
    if (event.key === 'Enter') {
      accountLoginSubmit();
    }
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

  return (
    <div className="account-form-container" onKeyPress={keyboardFormSubmit}>
      <div className="account-form-header">
        <h1>Log in</h1>
      </div>
      {loginForm()}
      {loginActions()}
    </div>
  );
}

export default AccountLogin;