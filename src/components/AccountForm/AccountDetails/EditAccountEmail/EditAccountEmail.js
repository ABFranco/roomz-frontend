import React, {  useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './EditAccountEmail.css';

import { useDispatch, useSelector } from 'react-redux';
import store from '../../../../store';
import { emailEdit } from '../../../../reducers/UserSlice';
import { setErrorMessage } from '../../../../reducers/NotificationSlice';


function EditAccountEmail() {
  const dispatch = useDispatch();
  const signedIn = useSelector(state => (state.user.userId != null));

  const history = useHistory();

  const oldEmailInput = useRef();
  const newEmailInput = useRef();
  const confirmNewEmailInput = useRef();


  /**
   * @function emailEditSubmit - Submit the Edit Email form
   */
  
  async function emailEditSubmit() {
    // check if the user enters their current email correctly
    if(store.getState().user.email !== oldEmailInput.current.value) {
      dispatch(setErrorMessage('Incorrect email!'));
      return;
    }

    if (newEmailInput.current.value !== confirmNewEmailInput.current.value) {
      dispatch(setErrorMessage('Emails do not match!'));
      return;
    }

    let data = {
      oldEmail: oldEmailInput.current.value,
      newEmail: newEmailInput.current.value,
    };

    try {
      const response = await dispatch(emailEdit(data));
      if ('error' in response) {
        throw response['error'];
      }

      history.push('/account/details');

    } catch (err) {
      console.log(':emailEditSubmit: er=%o', err);
      let errorMessage = 'An unexpected error has occurred when editing an email.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
    }
  }

  function leaveEditEmailForm() {
    history.push('/account/details');
  }
  
  function emailForm() {
    return (
      <form className="email-form">
        <div className="email-form-input">
          <label htmlFor="oldEmail">Old Email</label>
          <input id="oldEmail" ref={oldEmailInput} type="email" />
        </div>
        <div className="email-form-input">
          <label htmlFor="newEmail">New Email</label>
          <input id="newEmail" ref={newEmailInput} type="email" />
        </div>
        <div className="email-form-input">
          <label htmlFor="confirmNewEmail">Confirm New Email</label>
          <input id="confirmNewEmail" ref={confirmNewEmailInput} type="email" />
        </div>
      </form> 
    );
  }

  function emailFormActions() {
    return (
      <div className="email-actions">
        <Link to="/account/details">
          <button className="email-form-btn button-secondary" onClick={leaveEditEmailForm}>Cancel</button>
        </Link>
        <button className="email-form-btn button-primary" onClick={emailEditSubmit}>Submit</button>
      </div>
    );
  }

  function view() {
    if (!signedIn) {
      return (
        <div className="email-container">
          <div className="not-signed-in">
            <h2>Not Signed In</h2>
          </div>
          <Link to="/">
            <button className="email-form-btn button-secondary">Return Home</button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="email-form-container">
          <div className="email-header">
            <h1>Edit Email</h1>
          </div>
          {emailForm()}
          {emailFormActions()}
        </div>
      );
    }
  }

  return view();
}

export default EditAccountEmail;