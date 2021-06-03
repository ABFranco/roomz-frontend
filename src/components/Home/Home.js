import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Home.css';

import { useDispatch, useSelector } from 'react-redux';
import store from '../../store';
import { clearSignInData } from '../../reducers/UserSlice';
import { clearRoomData } from '../../reducers/RoomSlice';
import { clearVestibuleData } from '../../reducers/VestibuleSlice';
import { clearChatHistory } from '../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../reducers/NotificationSlice';

function Home() {
  const dispatch = useDispatch();
  const signedIn = useSelector(state => (state.user.userId !== null));

  const history = useHistory();

  useEffect(() => {
    // upon initial load, clear everything
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    dispatch(clearVestibuleData());
  }, []);


  /**
   * Handle click event for "Create Room" button
   */
  function roomCreate() {
    if (signedIn) {
      history.push('/room/create');
    } else {
      dispatch(setErrorMessage('Sign-in before creating a room!'));
    }
  }


  /**
   * Handle click event for "Sign Out" button
   */
  function accountLogout() {
    dispatch(clearSignInData());
  }


  /**
   * Text if user is Signed-In
   */
  function helloUser() {
    if (signedIn) {
      return (
        <div className="home-hello-user">
          <p className="home-hello-msg"><b>Signed-In as: </b>
          {store.getState().user.firstName}
          </p>
        </div>
      );
    }
  }


  /**
   * Display actions depending on user being Sign-In
   */
  function determineHomeActions() {
    if (signedIn) {
      return (
        <div className="home-actions-account">
          <button className="button-secondary">Account Details</button>
          <button className="button-secondary" onClick={accountLogout}>Sign Out</button>
        </div>
      )   
    } else {
      return (
        <div className="home-actions-account">
          <Link to="account/create">
            <button className="button-secondary">Create Account</button>
          </Link>
          
          <Link to="/account/login">
            <button className="button-secondary">Sign In</button>
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
          <button className="button-primary">Join Room</button>
        </Link>
        {determineHomeActions()}
      </div>
    </div>
  )
}

export default Home;