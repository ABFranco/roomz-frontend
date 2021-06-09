import React, {  useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './EditAccountPassword.css';

import { useDispatch, useSelector } from 'react-redux';
import { setErrorMessage } from '../../../../reducers/NotificationSlice';

function EditAccountPassword() {
    const dispatch = useDispatch();
    const signedIn = useSelector(state => (state.user.userId != null));
  
    const history = useHistory();
  
    const emailInput = useRef();
    const oldPasswordInput = useRef();
    const newPasswordInput = useRef();
    const confirmNewPasswordInput = useRef();
  
    async function editPasswordSubmit() {
  
    }
  
    function leaveEditPasswordForm() {
  
    }
  
    function passwordForm() {
      return (
        <form className="password-form">
          <div className="password-form-input">
            <label htmlFor="email">Email</label>
            <input id="Email" ref={emailInput} type="email" />
          </div>
          <div className="password-form-input">
            <label htmlFor="oldPassword">Old Password</label>
            <input id="oldPassword" type="password" ref={oldPasswordInput}/>
          </div>
          <div className="password-form-input">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" type="password" ref={newPasswordInput}/>
          </div>
          <div className="password-form-input">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input id="newPassword" type="password" ref={confirmNewPasswordInput}/>
          </div>
        </form> 
      );
    }
  
    function passwordFormActions() {
      return (
        <div className="password-actions">
          <Link to="/account/details">
            <button className="password-form-btn button-secondary" onClick={leaveEditPasswordForm}>Cancel</button>
          </Link>
          <button className="password-form-btn button-primary" onClick={editPasswordSubmit}>Submit</button>
        </div>
      );
    }
  
    function view() {
      if (!signedIn) {
        return (
          <div className="password-container">
            <div className="not-signed-in">
              <h2>Not Signed In</h2>
            </div>
            <Link to="/">
              <button className="password-form-btn button-secondary">Return Home</button>
            </Link>
          </div>
        );
      } else {
        return (
          <div className="password-form-container">
            <div className="password-header">
              <h1>Edit Password</h1>
            </div>
            {passwordForm()}
            {passwordFormActions()}
          </div>
        );
      }
    }
  
    return view();
  }
  
  export default EditAccountPassword;
  
  
  