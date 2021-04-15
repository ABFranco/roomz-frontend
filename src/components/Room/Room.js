import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { setCachedObject } from '../../util/cache';
import Chatroom from './Chatroom';
import thumbsUp from '../../assets/thumbs_up.png';
import thumbsDown from '../../assets/thumbs_down.png';
import './Room.css';
import * as apiClient from '../../api/RoomzApiServiceClient.js'

function Room(props) {
    const history = useHistory();

    const [roomId, setRoomId] = useState(null);            // ID of room the user is currently in
    const [joinRequests, setJoinRequests] = useState([]);  // list of names of users requesting to join room
    const [errorMessage, setErrorMessage] = useState("");  // error message


    // update local hook
    useEffect(() => {
        setRoomId(props.roomInfo.roomId);
    }, [props.roomInfo])


    function resetRoomInfo() {
        props.setRoomInfo((prevRoomInfo) => ({
            ...prevRoomInfo,
            roomId        : null,
            userIsHost    : false,
            isStrict      : null,
            userIsJoining : false,
            userInRoom    : false
        }))
    }

    function roomLeave() {
        // non-host leaves the room
        
        let data = {
            'roomId'       : roomId,
            'userId'       : props.userInfo.userId,
        }

        // update cache 'in waiting room' logic
        setCachedObject('inWaitingRoom', false);
        console.log(':Room.roomLeave: marking cache as false');

        console.log(':Room.roomLeave: Leaving room with data=%o', data);

        apiClient.leaveRoom(data)
            .then(response => {
                console.log(':RoomForm.roomLeave: response=%o', response);
                // Note: leaveRoom returns no data. Knowing the response was successful is all that's needed

                props.setRoomInfo((prevRoomInfo) => ({
                    ...prevRoomInfo,
                    roomId      : null,
                    userIsHost  : false,
                    isStrict    : false,
                    userInRoom  : false,
                    chatHistory : []
                }));

                // go home
                history.push("/");
            })
            .catch(error => {
                console.log(':RoomForm.roomLeave: error=%o', error);

                let errorMessage = "An unexpected error has occurred when leaving the Room.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }

                console.warn(errorMessage);
                setErrorMessage(errorMessage);
            });
    }

    function roomCancel() {
        // room participant is in an invalid room url and exits

        // NOTE: going home via React Router Link
        resetRoomInfo();
    }


    //  Host closes the Room.
    function roomDelete() {
        let data = {
            'roomId'      : roomId,
            // 'host_user_id' : props.userInfo.userId
        }

        console.log(':Room.roomDelete: marking cache as false')
        // update cache 'in waiting room' logic
        setCachedObject('inWaitingRoom', false);

        apiClient.closeRoom(data)
            .then(response => {
                console.log(':RoomForm.roomDelete: response=%o', response);
                // Note: closeRoom returns no data. Knowing the response was successful is all that's needed

                props.setRoomInfo((prevRoomInfo) => ({
                    ...prevRoomInfo,
                    roomId      : null,
                    userIsHost  : false,
                    isStrict    : false,
                    userInRoom  : false,
                    chatHistory : []
                }));
                // setSubmitError(false);

                // go home
                history.push("/");
            })
            .catch(error => {
                console.log(':RoomForm.roomDelete: error=%o', error);

                let errorMessage = "An unexpected error has occurred when closing the Room.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }

                console.warn(errorMessage);
                setErrorMessage(errorMessage);
            });
    }


    // set join request data into state
    function handleGetJoinRequestsResp(response) {
        let joinRequests = [];
        let incomingJoinRequests = response.getJoinRequestsList();
        console.log(':Room.handleGetJoinRequestsResp: incomingJoinRequests=%o', incomingJoinRequests);

        for (var i = 0; i < incomingJoinRequests.length; i++) {
            joinRequests.push({
                'userId' : incomingJoinRequests[i].getUserId(),
                'name' : incomingJoinRequests[i].getUserName()
            })
        }

        // set state
        setJoinRequests(joinRequests);
    }

    // retrieve the current join requests that are pending
    function updateJoinRequests() {
        // retrieve current join requests
        let data = {
            'roomId' : roomId,
            'userId' : props.userInfo.userId
        }
        
        apiClient.getJoinRequests(data)
            .then(response => {
                console.log(':Room.updateJoinRequests: response=%o', response);
                handleGetJoinRequestsResp(response);
            })
            .catch(error => {
                console.log(':Room.updateJoinRequests: error=%o', error);

                let errorMessage = "An unexpected error has occurred when retrieving join requests.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }
                console.warn(errorMessage);
            });
    }

    function requestsViewClick() {
        // open/close requests window

        if (document.getElementById("requestsView").classList.contains("hidden")) {
            document.getElementById("requestsView").classList.remove("hidden");

            // retreive current join requests
            updateJoinRequests();
        } else {
            document.getElementById("requestsView").classList.add("hidden");
        }
    }


    function handleRequest(userEntry, accept) {
        // handler for host accepting/rejecting join request

        let data = {
            'roomId'         : roomId,
            'userIdToHandle' : userEntry.userId,
            'decision'       : accept ? 'accept' : 'reject'
        }

        apiClient.handleJoinRequest(data)
            .then(response => {
                console.log(':Room.handleRequest: Sucessfully handled join request. response=%o', response);

                // refresh join requests
                updateJoinRequests();
            })
            .catch(error => {
                console.log(':Room.handleRequest: error=%o', error);

                let errorMessage = "An unexpected error has occurred when handling a join request.";
                if (error && "message" in error) {
                    errorMessage = error["message"];
                }
                console.warn(errorMessage);
            });
    }

    function requestsView() {
        return (
            <div className="room-requests-view">
                <p className="requests-title">Join Room Requests:</p>
                {joinRequests.map((r, index) => (
                    <div key={("request-%s", index)} className="pending-request-object">
                        <div className="pending-select-options-container">
                            <img id={("press-yes-%s", r.userId)} className="pending-img" src={thumbsUp} onClick={() => handleRequest(r, true)} alt="yes"/>
                            <br></br>
                            <img id={("press-no-%s", r.userId)} className="pending-img" src={thumbsDown} onClick={() => handleRequest(r, false)} alt="no"/>
                        </div>
                        <p className="pending-request-object-name">{r.name}</p>
                    </div>
                ))}
            </div>
        )
    }

    function roomShare() {
        // view "share" link
        // TODO
    }

    function roomViewActions() {
        if (props.roomInfo.userIsHost) {
            if (props.roomInfo.isStrict) {
                return (
                    <div className="room-actions">
                        <button className="room-form-btn button-secondary" onClick={roomDelete}>Close Room</button>
                        <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
                        <button id="joinRequestsBtn" className="room-form-btn button-primary" onClick={requestsViewClick}>Join Requests</button>
                    </div>
                )
            } else {
                return (
                    <div className="room-actions">
                        <button className="room-form-btn button-secondary" onClick={roomDelete}>Close Room</button>
                        <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
                    </div>
                )
            }
            
        } else {
            return (
                <div className="room-actions">
                    <button className="room-form-btn button-secondary" onClick={roomLeave}>Leave Room</button>
                    <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
                </div>
            )
            
        }
    }

    function roomView() {
        return (
            <div className="room-view">
                <div className="room-header">
                    <h1>Roomz</h1>
                </div>

                <p className="room-id-label"><b>Room ID: </b>{roomId}</p>
                <p><b>Your name: </b>{props.userInfo.name}</p>

                <div className="room-actions">
                    {roomViewActions()}
                </div>

                

                <Chatroom
                    roomId={roomId}
                    userInfo={props.userInfo}
                    roomInfo={props.roomInfo}
                    setRoomInfo={props.setRoomInfo}
                    />

                <p id="roomErrorMsg" className="">{errorMessage}</p>
            </div>
        ) 
    }

    function view() {
        if (props.roomInfo.userInRoom) {
            return (
                <div className="super-room-container">
                    <div className="room-container">
                        {roomView()}
                    </div>
                    <div id="requestsView" className="requests-container hidden">
                        {requestsView()}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="room-container">
                    <div className="invalid-room">
                        <h2>Invalid Room Id</h2>
                    </div>
                    <Link to="/">
                        <button className="room-form-btn button-secondary" onClick={roomCancel}>Return Home</button>
                    </Link>
                </div>
            )
        }
    }

    return view();
}

export default Room;