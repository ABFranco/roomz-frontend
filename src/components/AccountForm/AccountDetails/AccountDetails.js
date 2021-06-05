import React, {  useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './AccountDetails.css';

import { useDispatch } from 'react-redux';
import { setErrorMessage } from '../../../reducers/NotificationSlice';


function EditAccountEmail() {
	const dispatch = useDispatch();
	const signedIn = useSelector(state => (state.user.userId != null));

	const history = useHistory();

	const oldEmailInput = useRef();
	const newEmailInput = useRef();

	async function editEmailSubmit() {

	}

	function leaveEditEmailForm() {

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
			</form> 
		);
	}

	function emailFormActions() {
		return (
			<div className="email-actions">
				<Link to="/">
					<button className="email-form-btn button-secondary" onClick={leaveEditEmailForm}>Cancel</button>
				</Link>
				<button className="email-form-btn button-primary" onClick={editEmailSubmit}>Submit</button>
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



function EditAccountPassword() {
	const dispatch = useDispatch();
	const signedIn = useSelector(state => (state.user.userId != null));

	const history = useHistory();

	const emailInput = useRef();
	const oldPasswordInput = useRef();
	const newPasswordInput = useRef();

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
          <label htmlFor="oldPassword">Confirm Old Password</label>
          <input id="oldPassword" type="password" ref={oldPasswordInput}/>
        </div>
        <div className="password-form-input">
          <label htmlFor="newPassword">New Password</label>
          <input id="newPassword" type="password" ref={newPasswordInput}/>
        </div>
			</form> 
		);
	}

	function passwordFormActions() {
		return (
			<div className="password-actions">
				<Link to="/">
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



