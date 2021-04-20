import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../AccountForm.css';

import { useDispatch } from 'react-redux';
import { accountCreate, accountLogin } from '../../../reducers/UserSlice';


function AccountCreate() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState(null);

  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const password = useRef();
  const passwordVerify = useRef();
  
  
  /**
   * @function accountCreateSubmit - Submit the create Account form and create the Account
   * 
   * If createAccount is successful, user will automatically login
   */
  async function accountCreateSubmit() {
    if (password.current.value !== passwordVerify.current.value) {
      // ensure passwords are correct
      setErrorMessage("Passwords do not match!");

    } else {
      let data = {
        'firstName' : firstName.current.value,
        'lastName'  : lastName.current.value,
        'email'     : email.current.value,
        'password'  : password.current.value
      }

      try {
        const response = await dispatch(accountCreate(data));
        if ('error' in response) {
          throw response['error'];
        }
        
        // account successfully created, attempt to login with these details
        let accountLoginData = {
          'email'     : email.current.value,
          'password'  : password.current.value
        }
        const responseLogin = await dispatch(accountLogin(accountLoginData));
        if ('error' in responseLogin) {
          throw responseLogin['error'];
        }
  
        // creation and login successful, state updated, go home
        history.push('/')
  
      } catch (err) {
        console.log(':accountCreateSubmit: err=%o', err);
        let errorMessage = 'An unexpected error has occurred when creating an account.';
        if (err && 'message' in err) {
            errorMessage = err['message'];
        }
        setErrorMessage(errorMessage);
      }
    }
  }

  
  function keyboardFormSubmit(event) {
    if (event.key === 'Enter') {
      accountCreateSubmit();
    }
  }

  function createForm() {
    return (
      <form className="account-form">
        <div className="account-form-input">
          <label htmlFor="firstName">First Name</label>
          <input type="text" ref={firstName} autoFocus />
        </div>
        <div className="account-form-input">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" ref={lastName}/>
        </div>
        <div className="account-form-input">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" ref={email}/>
        </div>
        <div className="account-form-input">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" ref={password}/>
        </div>
        <div className="account-form-input">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input id="passwordConfirm" type="password" ref={passwordVerify}/>
        </div>
      </form>
    )
  }

  function createActions() {
    return (
      <div className="account-form-actions">
        <Link to="/">
          <button className="account-form-btn button-secondary">Cancel</button>
        </Link>
        <button className="account-form-btn button-primary" onClick={accountCreateSubmit}>Register</button>
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
          <h1>Create an account</h1>
      </div>
      {createForm()}
      {createActions()}
      {errorMessageDisplay()}
    </div>
  )
}

export default AccountCreate;