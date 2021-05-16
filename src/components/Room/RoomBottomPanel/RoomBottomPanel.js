import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../Room.css';
import './RoomBottomPanel.css';

import { getJoinRequests } from '../../../api/RoomzApiServiceClient.js';

import { useDispatch } from 'react-redux';
import { clearChatHistory } from '../../../reducers/ChatroomSlice';
import { setErrorMessage } from '../../../reducers/NotificationSlice';
import { roomDelete, roomLeave } from '../../../reducers/RoomSlice';

import store from '../../../store';

function RoomBottomPanel() {
  const dispatch = useDispatch();
  const history = useHistory();

  // TODO: move joinRequests to store
  const [joinRequests, setJoinRequests] = useState([]);  // list of names of users requesting to join room

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
      dispatch(setErrorMessage(errorMessage));
    }
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
      dispatch(setErrorMessage(errorMessage));
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
      console.log(':updateJoinRequests: err=%o', err);
      let errorMessage = 'An unexpected error has occurred when retrieving join requests.';
      if (err && 'message' in err) {
        errorMessage = err['message'];
      }
      dispatch(setErrorMessage(errorMessage));
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


  function roomShare() {
    // TODO
    return;
  }

  function panelActions() {
    if (store.getState().room.userIsHost) {
      if (store.getState().room.isStrict) {
        return (
          <div className="room-bottom-panel-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
            <button id="joinRequestsBtn" className="room-form-btn button-primary" onClick={requestsViewClick}>Join Requests</button>
          </div>
        );
      } else {
        return (
          <div className="room-bottom-panel-actions">
            <button className="room-form-btn button-secondary" onClick={roomDeleteAsHost}>Close Room</button>
            <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
          </div>
        );
      }
        
    } else {
      return (
        <div className="room-bottom-panel-actions">
          <button className="room-form-btn button-secondary" onClick={roomLeaveAsNonHost}>Leave Room</button>
          <button className="room-form-btn button-primary" onClick={roomShare}>Share</button>
        </div>
      );
        
    }

  }

  return (
    <div className="room-bottom-panel">
      <div className="room-desc">
        <h1>Roomz</h1>
        <p><b>Room ID: </b>{store.getState().room.roomId}</p>
        <p><b>Your name: </b>{store.getState().room.roomUserName}</p>
      </div>

      <div className="room-actions">
        {panelActions()}
      </div>
    </div>
  )
}

export default RoomBottomPanel;