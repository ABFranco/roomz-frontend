import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';

function Home(props) {
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState("error");

    function roomCreate() {
        if (props.userInfo.signedIn) {
            history.push("/room/create");
        } else {
            document.getElementById("homeErrorMsg").classList.remove("hidden-message");
            setErrorMessage("Sign-in before creating a room!");
        }
    }

    function roomJoin() {
        // TODO: anything special
    }

    function accountCreate() {
        // TODO: anything special
    }

    function accountLogin() {
        // TODO: anything special
    }

    function accountLogout() {
        props.signOutUser();
    }

    function helloUser() {
        if (props.userInfo.signedIn) {
            return (
                <div className="home-hello-user">
                    <p className="home-hello-msg"><b>Signed-In as: </b>
                    {props.userInfo.firstName}
                    </p>
                </div>
            );
        }
    }

    function accountDetails() {
        // TODO: anything special
    }

    function determineHomeActions() {
        if (props.userInfo.signedIn) {
            return (
                <div className="home-actions-account">
                    <button className="button-secondary" onClick={accountDetails}>Account Details</button>
                    <button className="button-secondary" onClick={accountLogout}>Sign Out</button>
                </div>
            )   
        } else {
            return (
                <div className="home-actions-account">
                    <Link to="account/create">
                        <button className="button-secondary" onClick={accountCreate}>Create Account</button>
                    </Link>
                    
                    <Link to="/account/login">
                        <button className="button-secondary" onClick={accountLogin}>Sign In</button>
                    </Link>
                </div>
            )   
        }
    }

    return (
        <div className="home-container">
          <div className="home-header">
            <h1>Roomz</h1>
          </div>
  
          <div className="home-actions">
              {helloUser()}
              <button className="button-primary" onClick={roomCreate}>Create Room</button>
              <Link to="/room/join" className="link-button-wrapper">
                <button className="button-primary" onClick={roomJoin}>Join Room</button>
              </Link>
              {determineHomeActions()}
              <p id="homeErrorMsg" className="hidden-message">{errorMessage}</p>
          </div>
        </div>
      );
}

export default Home;