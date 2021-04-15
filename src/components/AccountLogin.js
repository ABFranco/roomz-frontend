import React, { useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './AccountLogin.css';
import * as apiClient from '../api/RoomzApiServiceClient.js'


function AccountLogin(props) {
    const history = useHistory();

    const [submitError, setSubmitError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const email = useRef();
    const firstName = useRef();
    const lastName = useRef();
    const password = useRef();
    const password_verify = useRef();

    const login_email = useRef();
    const login_password = useRef();

    function accountCreateSubmit() {
        if (password.current.value !== password_verify.current.value) {
            // ensure passwords are correct
            setSubmitError(true);
            setErrorMessage("Passwords do not match!");
        } else {
            let data = {
                'firstName' : firstName.current.value,
                'lastName'  : lastName.current.value,
                'email'     : email.current.value,
                'password'  : password.current.value
            }
               
            apiClient.createAccount(data)
                .then(response => {
                    console.log(':accountCreateSubmit: response=%o', response);
                    let userId = response.getUserId();

                    // sign-in user
                    props.signInUser(
                        userId, 
                        data['firstName'], 
                        data['lastName'], 
                        data['email'], 
                        data['password']
                    );
                    setSubmitError(false);
        
                    // go home on success
                    history.push("/");
                })
                .catch(error => {
                    console.log(':accountCreateSubmit: error=%o', error);

                    setSubmitError(true)
                    let errorMessage = "An unexpected error has occurred when creating an account.";
                    if (error && "message" in error) {
                        errorMessage = error["message"];
                    }
                    setErrorMessage(errorMessage);
                });
        }
    }

    function accountLoginSubmit() {
        let data = {
            'email'     : login_email.current.value,
            'password'  : login_password.current.value
        }

        apiClient.signIn(data)
            .then(response => {
                console.log(':accountLoginSubmit: response=%o', response);
                let userId    = response.getUserId(),
                    firstName = response.getFirstName(),
                    lastName  = response.getLastName();
                console.log(':accountLoginSubmit: userId=%s firstName=%s lastName=%s', userId, firstName, lastName);

                // sign-in user
                props.signInUser(
                    userId,
                    firstName,
                    lastName,
                    data['email'],
                    data['password']
                );
                setSubmitError(false);

                // go home on success
                history.push("/")
            })
            .catch(error => {
                console.log(':accountLoginSubmit: error=%o', error);
                setSubmitError(true)
                let errorMessage = "An unexpected error has occurred when signing in.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }
                setErrorMessage(errorMessage);
            });
    }

    function keyboardLoginSignin(event) {
        if (event.key === "Enter") {
            if (props.isNewAccount) {
                accountCreateSubmit();
            } else {
                accountLoginSubmit();
            }
        }
    }

    const formHeader = () => {
        if (props.isNewAccount) {
            return (
                <div className="account-login-header">
                    <h1>Create an account</h1>
                </div>
            )   
        } else {
            return (
                <div className="account-login-header">
                    <h1>Log in</h1>
                </div>
            )
        }
    }

    const formType = () => {
        if (props.isNewAccount) {
            return (
              <form className="account-login-form">
                <div className="account-login-form-input">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" ref={firstName} autoFocus />
                </div>
                <div className="account-login-form-input">
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" type="text" ref={lastName}/>
                </div>
                <div className="account-login-form-input">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" ref={email}/>
                </div>
                <div className="account-login-form-input">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" ref={password}/>
                </div>
                <div className="account-login-form-input">
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input id="passwordConfirm" type="password" ref={password_verify}/>
                </div>
            </form>
            )   
        } else {
            return (
              <form className="account-login-form">
                <div className="account-login-form-input">
                    <label htmlFor="login-email">Email</label>
                    <input id="login-email" type="email" ref={login_email} autoFocus/>
                </div>
                <div className="account-login-form-input">
                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" type="password" ref={login_password} />
                </div>
              </form>
            )   
        }
    }

    const formActions = () => {
        if (props.isNewAccount) {
            return (
                <div className="account-login-actions">
                    <Link to="/">
                        <button className="account-login-btn button-secondary">Cancel</button>
                    </Link>
                    <button className="account-login-btn button-primary" onClick={accountCreateSubmit}>Register</button>
                </div>
            )   
        } else {
            return (
                <div className="account-login-actions">
                    <Link to="/">
                        <button className="account-login-btn button-secondary">Cancel</button>
                    </Link>
                    <button className="account-login-btn button-primary" onClick={accountLoginSubmit}>Log In</button>
                </div>
            )   
        }
    }

    const errorMessageDisplay = () => {
        if (submitError) {
            if (props.isNewAccount) {
                return (
                    <div className="account-create-error-area">
                        <p className="account-create-error-msg">{errorMessage}</p>
                    </div>
                )
            } else {
                return (
                    <div className="account-login-error-area">
                        <p className="account-login-error-msg">{errorMessage}</p>
                    </div>
                )
            }
        }
    }

    return (
        <div className="account-login-container" onKeyPress={keyboardLoginSignin}>
        {formHeader()}
        {formType()}
        {formActions()}
        {errorMessageDisplay()}
        </div>
    );
}

export default AccountLogin;