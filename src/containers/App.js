import React from 'react';
import { 
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import './App.css';
import './Landing.css';

import Home from '../components/Home';
import AccountForm from '../components/AccountForm';
import RoomForm from '../components/RoomForm';
import Room from '../components/Room';
import Vestibule from '../components/Vestibule';
import Notification from '../components/Notification';


function App() {
  return (
    <div className="App">
      <div className="landing-container">
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

            <Route path="/vestibule/:roomId">
              <Vestibule />
            </Route>

            <Route path="/room/:roomId">
              <Room />
            </Route>
            
          </Switch>
        </Router>
        <Notification />
      </div>
    </div>
  );
}

export default App;