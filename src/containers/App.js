import React from 'react';
import { 
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import './App.css';
import './Landing.css';

import { Snackbar, IconButton }from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage } from '../reducers/NotificationSlice';

import Home from '../components/Home';
import AccountForm from '../components/AccountForm';
import RoomForm from '../components/RoomForm';
import Room from '../components/Room';


function App() {
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => (state.notification.error));

  function displayNotification() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={errorMessage !== null}
        autoHideDuration={5000}
        onClose={() => {dispatch(clearErrorMessage())}}
        message={errorMessage}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => {dispatch(clearErrorMessage())}}>
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    );
  }


  return (
    <div className="App">
      <div className="landing-container">
        <div className="home-page">
          <br></br>
          <Router>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/account">
                <AccountForm />
              </Route>

              <Route path="/room/create">
                <RoomForm />
              </Route>
              <Route path="/room/join">
                <RoomForm />
              </Route>

              <Route path="/room/:roomId">
                <Room/>
              </Route>
              
            </Switch>
          </Router>
        </div>
        {displayNotification()}
      </div>
    </div>
  );
}

export default App;