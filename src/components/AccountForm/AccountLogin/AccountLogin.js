import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../AccountForm.css';

import { useDispatch } from 'react-redux';
import { accountLogin } from '../../../reducers/UserSlice';


function AccountLogin() {
  const dispatch = useDispatch();
  
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);

  const loginEmail = useRef();
  const loginPassword = useRef();


  /**
   * @function accountLoginSubmit - Call api to attempt user login
   */
  async function accountLoginSubmit() {
    let data = {
      'email'     : loginEmail.current.value,
      'password'  : loginPassword.current.value
    }

    try {
      const response = await dispatch(accountLogin(data));
      if ('error' in response) {
        throw response['error'];
      }

       // login successful, state updated, go home
       history.push("/")

    } catch (err) {
      console.log(':accountLoginSubmit: err=%o', err);
      let errorMessage = "An unexpected error has occurred when signing in.";
      if (err && "message" in err) {
          errorMessage = err["message"];
      }
      setErrorMessage(errorMessage);
    }
  }


  function keyboardFormSubmit(event) {
    if (event.key === "Enter") {
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
    )
  }

  function loginActions() {
    return (
      <div className="account-form-actions">
        <Link to="/">
          <button className="account-form-btn button-secondary">Cancel</button>
        </Link>
        <button className="account-form-btn button-primary" onClick={accountLoginSubmit}>Log In</button>
      </div>
    )
  }

  function errorMessageDisplay() {
    if (errorMessage) {
      return (
        <div className="account-form-error-area">
          <p className="account-form-error-msg">{errorMessage}</p>
        </div>
      )
    }
  }


  return (
    <div className="account-form-container" onKeyPress={keyboardFormSubmit}>
      <div className="account-form-header">
          <h1>Log in</h1>
      </div>
      {loginForm()}
      {loginActions()}
      {errorMessageDisplay()}
    </div>
  )
}

export default AccountLogin;