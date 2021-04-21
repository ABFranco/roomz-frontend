import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import thumbsUp from '../../assets/thumbs_up.png';
import thumbsDown from '../../assets/thumbs_down.png';
import './Room.css';

import Chatroom from './Chatroom';
import { awaitRoomClosure, getJoinRequests, handleJoinRequest } from '../../api/RoomzApiServiceClient.js';

import { useDispatch, useSelector } from 'react-redux';
import { roomDelete, roomLeave, clearRoomData } from '../../reducers/RoomSlice';
import { clearChatHistory } from '../../reducers/ChatroomSlice';


import store from '../../store';

function Room() {
  const dispatch = useDispatch();
  const userInRoom = useSelector(state => (state.room.userInRoom !== null));

  const history = useHistory();

  const [joinRequests, setJoinRequests] = useState([]);  // list of names of users requesting to join room
  const [errorMessage, setErrorMessage] = useState('');  // error message


  useEffect(() => {
    // this should only occur once when a non-host
    if (!store.getState().room.userIsHost) {
      joinRoomClosureStream();
    }
  },[]);


  /**
   * @function roomLeaveAsNonHost - non-host leaves the room
   */
  async function roomLeaveAsNonHost() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    console.log(':Room.roomLeave: Leaving room with data=%o', data);

    try {
      const response = await dispatch(roomLeave(data));
      if ('error' in response) {
        throw response['error'];
      }

      dispatch(clearChatHistory());
      history.push('/');

    } catch (err) {
      console.log(':RoomForm.roomLeaveAsNonHost: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when leaving the Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  /**
   * @function roomLeaveInvalid - room participant is in an invalid room url and exits
   */
  function roomLeaveInvalid() {
    dispatch(clearRoomData());
    dispatch(clearChatHistory());
    history.push('/');
  }


  /**
   * @function roomDeleteAsHost - Host closes the Room
   */
  async function roomDeleteAsHost() {
    let data = {
      roomId: store.getState().room.roomId,
    };

    try {
      const response = await dispatch(roomDelete(data));
      if ('error' in response) {
        throw response['error'];
      }

      dispatch(clearChatHistory());
      history.push('/');

    } catch (err) {
      console.log(':RoomForm.roomDelete: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when closing the Room.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  /**
   * @function joinRoomClosureStream - If non-host, join stream to detect when host closes the room
   */
  async function joinRoomClosureStream() {
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().room.userId,
      token: store.getState().room.token,
    };
    console.log(':Chatroom.joinRoomClosureStream: Attempting to join closure stream with data=%o', data);

    try {
      const closureStream = await awaitRoomClosure(data);
      
      closureStream.on('data', (data) => {
        dispatch(clearRoomData());
        dispatch(clearChatHistory());
        history.push('/');
      });

      closureStream.on('end', () => {
        console.log(':Chatroom.joinRoomClosureStream: Stream ended.');
      });

    } catch (err) {
      console.log(':Chatroom.joinRoomClosureStream: Failed to receive closure stream. err=%o', err);
    }
  }


  /**
   * @function updateJoinRequests - retrieve the current join requests that are pending
   */
  async function updateJoinRequests() {
    // retrieve current join requests
    let data = {
      roomId: store.getState().room.roomId,
      userId: store.getState().user.userId,
    };

    try {
      const response = await getJoinRequests(data);
      if ('error' in response) {
        throw response['error'];
      }

      // received current join requests, update state
      let joinRequests = [];
      let incomingJoinRequests = response.getJoinRequestsList();

      for (var i = 0; i < incomingJoinRequests.length; i++) {
        joinRequests.push({
          userId: incomingJoinRequests[i].getUserId(),
          name: incomingJoinRequests[i].getUserName(),
        });
      }

      setJoinRequests(joinRequests);

    } catch (err) {
      console.log(':RoomForm.updateJoinRequests: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when retrieving join requests.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  /** 
   * @function requestsViewClick - open/close requests window
   */ 
  function requestsViewClick() {
    if (document.getElementById('requestsView').classList.contains('hidden')) {
      document.getElementById('requestsView').classList.remove('hidden');

      // retreive current join requests
      updateJoinRequests();
    } else {
      document.getElementById('requestsView').classList.add('hidden');
    }
  }


  /**
   * @function respondToJoinRequest - handler for host accepting/rejecting join request as host
   * @param {Object} joinEntry - object with "userId" and "name"
   * @param {boolean} accept - true or false
   */
  async function respondToJoinRequest(joinEntry, accept) {
    let data = {
      roomId: store.getState().room.roomId,
      userIdToHandle: joinEntry.userId,
      decision: accept ? 'accept' : 'reject',
    };

    try {
      const response = await handleJoinRequest(data);
      if ('error' in response) {
        throw response['error'];
      }

      updateJoinRequests();

    } catch (err) {
      console.log(':RoomForm.respondToJoinRequest: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when handling a join request.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      setErrorMessage(errorMessage);
    }
  }


  function requestsView() {
    return (
      <div className="room-requests-view">
        <p className="requests-title">Join Room Requests:</p>
        {joinRequests.map((joinEntry, index) => (
          <div key={("request-%s", index)} className="pending-request-object">
            <div className="pending-select-options-container">
              <img id={("press-yes-%s", joinEntry.userId)} className="pending-img" src={thumbsUp} onClick={() => respondToJoinRequest(joinEntry, true)} alt="yes"/>
              <br></br>
              <img id={("press-no-%s", joinEntry.userId)} className="pending-img" src={thumbsDown} onClick={() => respondToJoinRequest(joinEntry, false)} alt="no"/>
            </div>
            <p className="pending-request-object-name">{joinEntry.name}</p>
          </div>
        ))}
      </div>
    )
  }

  function roomShare() {
      // TODO
      return;
  }

  function roomViewActions() {
    if (store.getState().room.userIsHost) {
      if (store.getState().room.isStrict) {
        return (
          <div className="room-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
            <button id="joinRequestsBtn" className="room-form-btn button-primary" onClick={requestsViewClick}>Join Requests</button>
          </div>
        );
      } else {
        return (
          <div className="room-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
          </div>
        );
      }
        
    } else {
      return (
        <div className="room-actions">
          <button className="room-form-btn button-secondary" onClick={roomLeaveAsNonHost}>Leave Room</button>
          <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
        </div>
      );
        
    }
  }

  function roomView() {
    return (
      <div className="room-view">
        <div className="room-header">
          <h1>Roomz</h1>
        </div>

        <p className="room-id-label"><b>Room ID: </b>{store.getState().room.roomId}</p>
        <p><b>Your name: </b>{store.getState().room.roomUserName}</p>

        <div className="room-actions">
          {roomViewActions()}
        </div>

        <Chatroom />

        <p id="roomErrorMsg" className="">{errorMessage}</p>
      </div>
    ) 
  }

  function view() {
    if (userInRoom) {
      return (
        <div className="super-room-container">
          <div className="room-container">
            {roomView()}
          </div>
          <div id="requestsView" className="requests-container hidden">
            {requestsView()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="room-container">
          <div className="invalid-room">
            <h2>Invalid Room Id</h2>
          </div>
          <Link to="/">
            <button className="room-form-btn button-secondary" onClick={roomLeaveInvalid}>Return Home</button>
          </Link>
        </div>
      );
    }
  }

  return view();
}

export default Room;