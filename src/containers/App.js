import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'; 
import store from '../store';
import './App.css';
import './Landing.css';

import Home from '../components/Home';
import AccountForm from '../components/AccountForm';
import RoomForm from '../components/RoomForm';
import Room from '../components/Room';


function App(props) {

    console.log(':App: Initial state: ', store.getState());

    const [userInfo, setUserInfo] = useState({
        isHost        : false,
        signedIn      : false,
        userId        : null,
        name          : null,
        firstName     : null,
        lastName      : null,
        email         : null,
        password      : null
    });
    const [roomInfo, setRoomInfo] = useState({
        roomId         : null,
        userIsHost     : false,
        isStrict       : false,
        userInRoom     : false,
        userIsJoining  : false,
        chatHistory    : [],
        token          : null
    });


    return (
        <div className="App">
            <div className='landing-container'>
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
                      <RoomForm
                          isCreateRoom={true}

                          // user
                          // userInfo={userInfo}
                          // updateUserName={updateUserName}
                          // updateUserId={updateUserId}

                          // room
                          roomInfo={roomInfo}
                          setRoomInfo={setRoomInfo}
                          />
                      </Route>

                      <Route path="/room/join">
                      <RoomForm
                          isCreateRoom={false}

                          // user
                          // userInfo={userInfo}
                          // updateUserName={updateUserName}
                          // updateUserId={updateUserId}

                          // room
                          roomInfo={roomInfo}
                          setRoomInfo={setRoomInfo}
                          />
                      </Route>

                      <Route path="/room/:roomId">
                      <Room
                          userInfo={userInfo}
                          roomInfo={roomInfo}
                          setRoomInfo={setRoomInfo}
                          />
                      </Route>

                  </Switch>
                </Router>
            </div>
            </div>
        </div>
    );
}

export default App;