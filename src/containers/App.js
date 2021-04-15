import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'; 
import './App.css';
import './Landing.css';
import Home from '../components/Home';
import AccountLogin from '../components/AccountLogin';
import RoomForm from '../components/RoomForm.js';
import Room from '../components/Room';
import { getCachedObject, setCachedObjectOnUpdate } from '../util/cache';

function App(props) {
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
    
    // edit user info
    function updateUserId(userId) {
        setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        userId: userId
        }))
    }

    function updateUserName(name) {
        setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        name : name
        }))
    }

    function signOutUser() {
        setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        signedIn : false
        }));
    }

    function signInUser(userId, firstName, lastName, email, password) {
        setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        signedIn : true,
        userId : userId,
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password
        }));
    }

    // retrieve from cache
    useEffect(() => {
        var cachedUserInfo = getCachedObject('userInfo');
        if (cachedUserInfo) {
            console.log('cachedUserInfo=');
            console.log(cachedUserInfo);
            setUserInfo(cachedUserInfo);
        }

        var cachedRoomInfo = getCachedObject('roomInfo');
        if (cachedRoomInfo) {
            console.log('cachedRoomInfo:');
            console.log(cachedRoomInfo);
            setRoomInfo(cachedRoomInfo);
        }
    }, [])

    // cache userInfo on update
    useEffect(() => {
       setCachedObjectOnUpdate('userInfo', userInfo);
    }, [userInfo]);

    // cache roomInfo on update
    useEffect(() => {
       setCachedObjectOnUpdate('roomInfo', roomInfo)
    }, [roomInfo])


    return (
        <div className="App">
            <div className='landing-container'>
            <div className="home-page">
                <br></br>
                <Router>
                <Switch>

                    <Route exact path="/">
                    <Home 
                        userInfo={userInfo}
                        signOutUser={signOutUser}
                        />
                    </Route>

                    <Route path="/account/create">
                    <AccountLogin
                        isNewAccount={true}

                        signInUser={signInUser}
                        signOutUser={signOutUser}
                        />
                    </Route>

                    <Route path="/account/login">
                    <AccountLogin
                        isNewAccount={false}

                        signInUser={signInUser}
                        signOutUser={signOutUser}
                        />
                    </Route>

                    <Route path="/room/create">
                    <RoomForm
                        isCreateRoom={true}

                        // user
                        userInfo={userInfo}
                        updateUserName={updateUserName}
                        updateUserId={updateUserId}

                        // room
                        roomInfo={roomInfo}
                        setRoomInfo={setRoomInfo}
                        />
                    </Route>

                    <Route path="/room/join">
                    <RoomForm
                        isCreateRoom={false}

                        // user
                        userInfo={userInfo}
                        updateUserName={updateUserName}
                        updateUserId={updateUserId}

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