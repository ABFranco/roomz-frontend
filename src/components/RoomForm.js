import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getCachedObject, setCachedObject } from '../util/cache';
import './RoomForm.css';
import * as apiClient from '../api/RoomzApiServiceClient.js'

function RoomForm(props) {
    const history = useHistory();

    const [grantedRoomAccess, setGrantedRoomAccess] = useState(false);
    const [requestedRoomId, setRequestedRoomId] = useState(null);
    const [inWaitingRoom, setInWaitingRoom] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    let passwordInput = useRef(null);
    let passwordConfirmInput = useRef();
    const createRoomName = useRef();
    const isStrictInput = useRef();

    const joinRoomId = useRef();
    const joinRoomPassword = useRef();
    const joinRoomName = useRef();

    
    useEffect(() => {
        // upon initial render, retrieve waiting room info in cache
        // determine if the user is supposed to be in the waiting room
        let cachedInWaitingRoom = getCachedObject('inWaitingRoom');
        console.log(':RoomForm: cachedInWaitingRoom=%s', cachedInWaitingRoom)
        if (cachedInWaitingRoom !== null) {
            // error check against incorrect caching
            if (props.roomInfo.userInRoom && cachedInWaitingRoom) {
                console.warn(':RoomForm: bad caching! setting inWaitingRoom to false')
                setCachedObject('inWaitingRoom', false)
                setInWaitingRoom(false)
            } else {
                console.log(':RoomForm: Setting inWaitingRoom for cachedInWaitingRoom=%s', cachedInWaitingRoom);
                setInWaitingRoom(cachedInWaitingRoom);

                if (cachedInWaitingRoom) {
                    // obtain original form data from cache and re-send another join request
                    let cacheData = getCachedObject('joinRoomData');
                    console.log(':RoomForm: cacheData=%o', cacheData);
                    roomJoinSubmit(cacheData['roomId'], cacheData['roomPassword'], cacheData['userName']);
                }

            }
        }
    }, [])


    
    useEffect(() => {
        // catch room id update, go to room page
        if (props.roomInfo.roomId !== null && props.roomInfo.token !== null && grantedRoomAccess) {
            console.log(':RoomForm: Granted room access with a valid room ID!');
            history.push(`/room/${props.roomInfo.roomId}`)
        }

        setRequestedRoomId(props.roomInfo.roomId)
    }, [props.roomInfo.roomId, grantedRoomAccess]);


    function _updateInWaitingRoom(value) {
        // update inWaitingRoom hook and cache values
        console.log(':RoomForm.updateInWaitingRoom: Updating and caching inWaitingRoom to: %s', value);
        setInWaitingRoom(value);
        setCachedObject('inWaitingRoom', value);
    }


    function roomCreateSubmit() {
        // submits Create Room form
        if (passwordInput.current.value !== passwordConfirmInput.current.value) {
            console.log(":RoomForm.roomCreateSubmit: Passwords do not match");
            document.getElementById('passwordConfirmMsg').classList.remove('hidden-message');
        } else {
            console.log(":RoomForm.roomCreateSubmit: Passwords match");
            document.getElementById('passwordConfirmMsg').classList.add('hidden-message');
            let username = createRoomName.current.value;
            let data = { 
                'userId'  : props.userInfo.userId,
                'username' : username,
                'password' : passwordInput.current.value,
                'isStrict' : !(isStrictInput.current.checked)
            }
            
            console.log(":RoomForm.roomCreateSubmit: Attempting to create room with data=%o", data);
            apiClient.createRoom(data)
                .then(response => {
                    console.log(':RoomForm.roomCreateSubmit: response=%o', response);

                    props.updateUserName(data['username']);

                    let roomId = response.getRoomId();
                    let isStrict = response.getIsStrict();
                    let token = response.getToken();

                    console.log(':roomCreateSubmit: roomId=%s, isStrict=%s, token=%s', roomId, isStrict, token);
                    
                    props.setRoomInfo((prevRoomInfo) => ({
                        ...prevRoomInfo,
                        roomId          : roomId,
                        userIsHost      : true,
                        isStrict        : isStrict,
                        userInRoom      : true,
                        chatHistory     : [],
                        token           : token
                    }));
                    setGrantedRoomAccess(true);
                    setSubmitError(false);
                })
                .catch(error => {
                    console.log(':RoomForm.roomCreateSubmit: error=%o', error);

                    let errorMessage = "Failed to create room!";
                    if (error && "message" in error) {
                        errorMessage = error["message"];
                    }

                    setSubmitError(true);
                    setErrorMessage(errorMessage);
                });
        }
    }
    

    // response after requesting to join a Room
    function receiveJoinRoomResponse(response) {
        let roomId = response.getRoomId();
        let userId = response.getUserId();
        let status = response.getStatus();
        let isStrict = false;
        let chatHistory = response.getChatHistoryList();
        let token = response.getToken();
        console.log(":RoomForm.receiveJoinRoomResponse: token=%s", token)

        setRequestedRoomId(roomId);
        props.updateUserId(userId);

        if (status === 'accept') {
            console.log(':RoomForm.receiveJoinRoomResponse: Accepted, joining room');
            setGrantedRoomAccess(true);
            setSubmitError(false);
            _updateInWaitingRoom(false);

            // cleanup chatHistory json
            let editedChatHistory = [];
            for (var i = 0; i < chatHistory.length; i++) {
                editedChatHistory.push({
                    'userID'    : chatHistory[i].getUserId(),
                    'name'      : chatHistory[i].getUserName(),
                    'message'   : chatHistory[i].getMessage(),
                    'timestamp' : chatHistory[i].getTimestamp()
                });
            }

            // edit room info
            props.setRoomInfo((prevRoomInfo) => ({
                ...prevRoomInfo,
                roomId          : roomId,
                userIsHost      : false,
                isStrict        : isStrict,
                userInRoom      : true,
                userIsJoining   : false,
                chatHistory     : editedChatHistory,
                token           : token
            }));

        } else if (status === 'wait') {
            console.log(':RoomForm.receiveJoinRoomResponse: Detected wait room');
            _updateInWaitingRoom(true);
            setSubmitError(false);

            // edit room info
            props.setRoomInfo((prevRoomInfo) => ({
                ...prevRoomInfo,
                roomId        : roomId,
                userIsHost    : false,
                isStrict      : true,
                userInRoom    : false,
                userIsJoining : true
            }));

        } else if (status === 'reject') {
            console.warn(":RoomForm.receiveJoinRoomResponse: Failed to join room.");

            _updateInWaitingRoom(false);
            setGrantedRoomAccess(false);

            setSubmitError(true);
            setErrorMessage("Failed to join room.");
        } else {
            console.warn(":RoomForm.receiveJoinRoomResponse: Unknown error.");
            setSubmitError(true);
            setErrorMessage("Unknown error.");
        }
    }


    
    function roomJoinSubmit(roomId, roomPassword, userName) {
        // perform join room submit
        let data = {
            'roomId'       : roomId,
            'roomPassword' : roomPassword,
            'userId'       : props.userInfo.userId,
            'userName'     : userName,
            'isGuest'      : !props.userInfo.signedIn
        }
        console.log(":RoomForm.roomJoinSubmit: Attempting to join room with data=%o", data);

        // update user info upon fresh join submit
        props.updateUserName(data['userName']);

        // save data into cache
        let cacheData = {
            'roomId'       : roomId,
            'roomPassword' : roomPassword,
            'userName'     : userName,
        }
        setCachedObject('joinRoomData', cacheData);

        console.log(":RoomForm.roomJoinSubmit: Attempting to join room with data=%o", data);

        apiClient.joinRoom(data)
            .then(joinRoomResponseStream => {
                console.log(':RoomForm.roomJoinSubmit: joinRoomResponseStream=%o', joinRoomResponseStream);

                // stream listeners
                joinRoomResponseStream.on('data', (response) => {
                    console.log(':RoomForm.joinRoom: response=%o', response);
                    receiveJoinRoomResponse(response);
                    
                });

                joinRoomResponseStream.on('error', (error) => {
                    console.log(':RoomForm.joinRoom: error: %o', error);
                    
                    let errorMessage = "Failed to join room!";
                    if (error && "message" in error) {
                        errorMessage = error["message"];
                    }
                    setSubmitError(true);
                    setErrorMessage(errorMessage);
                });

                joinRoomResponseStream.on('end', () => {
                    console.log(':RoomForm.joinRoom: Stream ended.');
                });


            })
            .catch(error => {
                console.log(':RoomForm.roomJoinSubmit: error=%o', error);

                let errorMessage = "Failed to join room!";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }

                setSubmitError(true);
                setErrorMessage(errorMessage);
            });
    }


    function roomJoinCancel() {
        // cancel join request when waiting for host acceptance
        console.log(':RoomForm.roomJoinCancel:; leaving waiting room...');
        
        let data = {
            'roomId'     : requestedRoomId,
            'userId'     : props.userInfo.userId
        }
        console.log(':RoomForm.roomJoinCancel: Cancelling join request with data=%o', data);

        // go home via React Router Link (regardless of apiClient success)
        _updateInWaitingRoom(false);

        apiClient.cancelJoinRequest(data)
            .then(response => {
                console.log(':RoomForm.roomJoinCancel: response=%o', response);

            })
            .catch(error => {
                console.log(':RoomForm.roomJoinCancel: error=%o', error);

                let errorMessage = "Failed to cancel room join.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }

                setSubmitError(true);
                setErrorMessage(errorMessage);
            });  
        
        
    }

    function roomJoinSubmitForm() {
        // handle form submit when performing form submission action
        roomJoinSubmit(joinRoomId.current.value, joinRoomPassword.current.value, joinRoomName.current.value);
    }


    function keyboardCreateJoin(event) {
        // handle keyboard input
        if (event.key === "Enter") {
            if (props.isCreateRoom) {
                roomCreateSubmit();
            } else if (!props.isCreateRoom && !inWaitingRoom) {
                roomJoinSubmitForm();
            }
        }
    }


    function roomHeader() {
        if (props.isCreateRoom) {
            return (
                <div className="room-header">
                    <h1>Create a Room</h1>
                </div>
            )   
        } else {
            return (
                <div className="room-header">
                    <h1>Join a Room</h1>
                </div>
            )   
        }
    }

    function roomForm() {
        if (props.isCreateRoom) {
            return (
                <form className="room-form">
                    <div className="room-form-input">
                        <label htmlFor="password">Room Password</label>
                        <input id="password" ref={passwordInput} type="password" autoFocus />
                    </div>
                    <div className="room-form-input">
                        <label htmlFor="passwordConfirm">Confirm Room Password</label>
                        <input id="passwordConfirm" ref={passwordConfirmInput} type="password" />
                        <p className="hidden-message" id="passwordConfirmMsg">Both passwords must match.</p>
                    </div>
                    <div className="room-form-input">
                        <label htmlFor="name">Your Name in the Room</label>
                        <input id="name" ref={createRoomName} type="text" />
                    </div>
                    <div className="room-form-checkbox">
                        <input id="passwordRequired" ref={isStrictInput} type="checkbox" />
                        <label htmlFor="passwordRequired">Anyone with password can join</label>
                    </div>
                </form>
            )   
        } else {
            return (
                <form className="room-form">
                    <div className="room-form-input">
                        <label htmlFor="roomID">Room ID</label>
                        <input id="roomID" ref={joinRoomId} type="text" autoFocus autoComplete="on"/>
                    </div>
                    <div className="room-form-input">
                        <label htmlFor="password">Room Password</label>
                        <input id="password" ref={joinRoomPassword} type="password" autoComplete="password"/>
                    </div>
                    <div className="room-form-input">
                        <label htmlFor="name">Your Name in the Room</label>
                        <input id="name" ref={joinRoomName} type="text" autoComplete="name"/>
                    </div>
                </form>
            )   
        }
    }

    function errorMessageDisplay() {
        // NOTE: create separate div for either display if necessary
        if (submitError) {
            return (
                <div className="room-submit-error-area">
                    <p className="room-submit-error-msg">{errorMessage}</p>
                </div>
            )
        }
    }


    function roomFormActions() {
        // roomCreate/Join has useEffect() call to switch to /room/:roomId page upon success
        if (props.isCreateRoom) {
            return (
                <div className="room-actions">
                    <Link to="/">
                        <button className="room-form-btn button-secondary">Cancel</button>
                    </Link>
                    <button className="room-form-btn button-primary" onClick={roomCreateSubmit}>Create</button>
                </div>
            )   
        } else {
            return (
                <div className="room-actions">
                    <Link to="/">
                    <button className="room-form-btn button-secondary">Cancel</button>
                    </Link>
                    <button className="room-form-btn button-primary" onClick={roomJoinSubmitForm}>Join</button>
                </div>
            )   
        }
    }

    function waitingRoom() {
        return (
            <div className="room-joining-strict">
                <div className="room-header">
                    <h1>Joining Room</h1>
                </div>

                <p className="room-id-label"><b>Room ID: </b>{requestedRoomId}</p>
                <h2>Pending host acceptance...</h2>

                <div className="room-actions">
                    <Link to="/">
                        <button className="room-form-btn button-secondary" onClick={roomJoinCancel}>Cancel</button>
                    </Link>
                </div>
            </div>
        )
    }

    function view() {
        if (inWaitingRoom) {
            return (
                <div className="room-container">
                    {waitingRoom()}
                </div>
            )
        } else if (props.isCreateRoom && !props.userInfo.signedIn) {
            return (
                <div className="room-container">
                    <div className="not-signed-in">
                        <h2>Not Signed In</h2>
                    </div>
                    <Link to="/">
                        <button className="room-form-btn button-secondary">Return Home</button>
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="room-container" onKeyPress={keyboardCreateJoin}>
                    {roomHeader()}
                    {roomForm()}
                    {errorMessageDisplay()}
                    {roomFormActions()}
                </div>
            )
        }
    }

    return view();
}

export default RoomForm;